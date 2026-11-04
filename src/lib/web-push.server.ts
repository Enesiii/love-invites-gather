// Dërgues Web Push vetëm për server (RFC 8291 aes128gcm + VAPID RFC 8292).
// Përdor WebCrypto — funksionon në workerd pa varësi nga Node.

function b64urlToBytes(value: string): Uint8Array {
  const b64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const bin = atob(b64 + "=".repeat((4 - (b64.length % 4)) % 4));
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
}

function bytesToB64url(bytes: ArrayBuffer | Uint8Array): string {
  const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let bin = "";
  for (const b of arr) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function concat(...parts: Uint8Array[]): Uint8Array {
  const out = new Uint8Array(parts.reduce((s, p) => s + p.length, 0));
  let offset = 0;
  for (const p of parts) {
    out.set(p, offset);
    offset += p.length;
  }
  return out;
}

async function hmacSha256(keyBytes: Uint8Array, data: Uint8Array): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey("raw", keyBytes as BufferSource, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return new Uint8Array(await crypto.subtle.sign("HMAC", key, data as BufferSource));
}

async function vapidJwt(endpoint: string, publicKey: string, privateKey: string, subject: string) {
  const pubBytes = b64urlToBytes(publicKey); // 0x04 || x || y
  const jwk: JsonWebKey = {
    kty: "EC",
    crv: "P-256",
    x: bytesToB64url(pubBytes.slice(1, 33)),
    y: bytesToB64url(pubBytes.slice(33, 65)),
    d: privateKey,
  };
  const key = await crypto.subtle.importKey("jwk", jwk, { name: "ECDSA", namedCurve: "P-256" }, false, ["sign"]);
  const header = bytesToB64url(new TextEncoder().encode(JSON.stringify({ typ: "JWT", alg: "ES256" })));
  const payload = bytesToB64url(
    new TextEncoder().encode(
      JSON.stringify({ aud: new URL(endpoint).origin, exp: Math.floor(Date.now() / 1000) + 12 * 3600, sub: subject }),
    ),
  );
  const unsigned = `${header}.${payload}`;
  const signature = await crypto.subtle.sign(
    { name: "ECDSA", hash: "SHA-256" },
    key,
    new TextEncoder().encode(unsigned) as BufferSource,
  );
  return `${unsigned}.${bytesToB64url(signature)}`;
}

export interface PushSubscriptionKeys {
  endpoint: string;
  p256dh: string;
  auth: string;
}

export type PushSendResult =
  | { ok: true }
  | { ok: false; gone: boolean; status: number; error: string };

/** Dërgon një njoftim push te një abonim. 404/410 = abonimi i skaduar. */
export async function sendWebPush(
  subscription: PushSubscriptionKeys,
  payload: string,
  vapid: { publicKey: string; privateKey: string; subject: string },
): Promise<PushSendResult> {
  try {
    const uaPublic = b64urlToBytes(subscription.p256dh);
    const authSecret = b64urlToBytes(subscription.auth);

    // Çelësi lokal ECDH i përkohshëm.
    const localPair = await crypto.subtle.generateKey({ name: "ECDH", namedCurve: "P-256" }, true, ["deriveBits"]);
    const localPublic = new Uint8Array(await crypto.subtle.exportKey("raw", localPair.publicKey));
    const uaKey = await crypto.subtle.importKey("raw", uaPublic as BufferSource, { name: "ECDH", namedCurve: "P-256" }, false, []);
    const sharedSecret = new Uint8Array(
      await crypto.subtle.deriveBits({ name: "ECDH", public: uaKey }, localPair.privateKey, 256),
    );

    // RFC 8291: IKM nga sekreti i përbashkët + auth secret.
    const encoder = new TextEncoder();
    const prkKey = await hmacSha256(authSecret, sharedSecret);
    const keyInfo = concat(encoder.encode("WebPush: info\0"), uaPublic, localPublic);
    const ikm = await hmacSha256(prkKey, concat(keyInfo, new Uint8Array([1])));

    const salt = crypto.getRandomValues(new Uint8Array(16));
    const prk = await hmacSha256(salt, ikm);
    const cek = (await hmacSha256(prk, concat(encoder.encode("Content-Encoding: aes128gcm\0"), new Uint8Array([1])))).slice(0, 16);
    const nonce = (await hmacSha256(prk, concat(encoder.encode("Content-Encoding: nonce\0"), new Uint8Array([1])))).slice(0, 12);

    // Rekord i vetëm: të dhënat + delimiter 0x02.
    const plain = concat(encoder.encode(payload), new Uint8Array([2]));
    const aesKey = await crypto.subtle.importKey("raw", cek as BufferSource, { name: "AES-GCM" }, false, ["encrypt"]);
    const ciphertext = new Uint8Array(
      await crypto.subtle.encrypt({ name: "AES-GCM", iv: nonce as BufferSource }, aesKey, plain as BufferSource),
    );

    const rs = new DataView(new ArrayBuffer(4));
    rs.setUint32(0, 4096);
    const body = concat(salt, new Uint8Array(rs.buffer), new Uint8Array([localPublic.length]), localPublic, ciphertext);

    const jwt = await vapidJwt(subscription.endpoint, vapid.publicKey, vapid.privateKey, vapid.subject);
    const res = await fetch(subscription.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Encoding": "aes128gcm",
        TTL: "86400",
        Authorization: `vapid t=${jwt}, k=${vapid.publicKey}`,
      },
      body: body as BodyInit,
    });
    if (res.status >= 200 && res.status < 300) return { ok: true };
    const text = await res.text().catch(() => "");
    return { ok: false, gone: res.status === 404 || res.status === 410, status: res.status, error: text.slice(0, 300) };
  } catch (err) {
    return { ok: false, gone: false, status: 0, error: err instanceof Error ? err.message : "Gabim i panjohur" };
  }
}
