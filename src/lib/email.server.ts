// Dërgimi i email-eve — vetëm server. Përdor Resend nëse RESEND_API_KEY është konfiguruar;
// përndryshe regjistron statusin "not_configured" pa hedhur gabim te klienti.

export type EmailResult = { ok: boolean; status: "sent" | "not_configured" | "failed"; error?: string };

export async function sendEmail(opts: { to: string; subject: string; html: string }): Promise<EmailResult> {
  const key = process.env["RESEND_API_KEY"]?.trim();
  const from = process.env["RESEND_FROM"]?.trim() || "Ftesa Dasme <porosite@ftesa-jone.com>";
  if (!key) {
    return { ok: false, status: "not_configured", error: "RESEND_API_KEY nuk është konfiguruar" };
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: opts.to, subject: opts.subject, html: opts.html }),
    });
    if (!res.ok) {
      const detail = (await res.text()).slice(0, 300);
      console.error("Resend failed", res.status, detail);
      return { ok: false, status: "failed", error: `Resend ${res.status}` };
    }
    return { ok: true, status: "sent" };
  } catch (err) {
    console.error("sendEmail failed", err);
    return { ok: false, status: "failed", error: "Gabim rrjeti gjatë dërgimit" };
  }
}

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function layout(title: string, body: string) {
  return `<!doctype html><html lang="sq"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title></head>
<body style="margin:0;padding:0;background:#faf7f2;font-family:Georgia,'Times New Roman',serif;color:#2b2620">
  <div style="max-width:560px;margin:0 auto;padding:32px 16px">
    <div style="text-align:center;padding:24px 0;border-bottom:2px solid #b08d3e">
      <div style="font-size:26px;letter-spacing:2px;color:#7a5c1e">Ftesa Dasme</div>
      <div style="font-size:12px;letter-spacing:4px;text-transform:uppercase;color:#9a8a6a;margin-top:6px">Ftesa digjitale të dasmës</div>
    </div>
    <div style="background:#ffffff;border:1px solid #e8ddc8;border-radius:12px;padding:28px 24px;margin-top:24px;font-size:15px;line-height:1.7">
      ${body}
    </div>
    <p style="text-align:center;font-size:12px;color:#9a8a6a;margin-top:24px">
      Ftesa Dasme · Ftesa digjitale të dasmës<br>Ky email u dërgua automatikisht — ju lutem mos i përgjigjeni.
    </p>
  </div>
</body></html>`;
}

function bankBlock(s: { bank_name: string; beneficiary: string; iban: string; instructions: string }, reference: string) {
  const row = (label: string, value: string) =>
    value ? `<tr><td style="padding:6px 12px 6px 0;color:#9a8a6a;vertical-align:top">${esc(label)}</td><td style="padding:6px 0;font-weight:bold">${esc(value)}</td></tr>` : "";
  return `<table style="margin:16px 0;border-collapse:collapse;background:#faf5ea;border:1px solid #e8ddc8;border-radius:8px;padding:12px 16px;width:100%">
    ${row("Banka", s.bank_name)}
    ${row("Përfituesi", s.beneficiary)}
    ${row("IBAN", s.iban)}
    ${row("Përshkrimi i pagesës", reference)}
  </table>${s.instructions ? `<p style="font-size:14px;color:#6a5f4d">${esc(s.instructions)}</p>` : ""}`;
}

export function paymentInstructionsEmail(opts: {
  customerName: string;
  orderNumber: string;
  packageLabel: string;
  amount: string;
  settings: { bank_name: string; beneficiary: string; iban: string; instructions: string; support_email: string };
}) {
  const body = `
    <p>Përshëndetje ${esc(opts.customerName)},</p>
    <p>Ftesa juaj u krijua me sukses. Për ta aktivizuar dhe për të marrë lidhjet e ndarjes, ju lutem përfundoni transfertën bankare më poshtë. Ftesa juaj aktivizohet pas verifikimit të pagesës.</p>
    <table style="margin:8px 0;border-collapse:collapse">
      <tr><td style="padding:4px 12px 4px 0;color:#9a8a6a">Numri i porosisë</td><td style="font-weight:bold">${esc(opts.orderNumber)}</td></tr>
      <tr><td style="padding:4px 12px 4px 0;color:#9a8a6a">Paketa</td><td>${esc(opts.packageLabel)}</td></tr>
      <tr><td style="padding:4px 12px 4px 0;color:#9a8a6a">Shuma</td><td style="font-weight:bold">${esc(opts.amount)}</td></tr>
    </table>
    ${bankBlock(opts.settings, opts.orderNumber)}
    <p style="font-size:14px">Shënoni numrin e porosisë <strong>${esc(opts.orderNumber)}</strong> te përshkrimi i pagesës, që ta identifikojmë transfertën tuaj sa më shpejt.</p>
    ${opts.settings.support_email ? `<p style="font-size:14px">Pyetje? Na shkruani te <a href="mailto:${esc(opts.settings.support_email)}">${esc(opts.settings.support_email)}</a>.</p>` : ""}
  `;
  return { subject: `Porosia ${opts.orderNumber} – Udhëzimet e pagesës`, html: layout("Udhëzimet e pagesës", body) };
}

export function paymentConfirmedEmail(opts: {
  customerName: string;
  orderNumber: string;
  packageLabel: string;
  amount: string;
  invitationUrl: string;
  dashboardUrl: string;
  whatsapp: string;
}) {
  const btn = (href: string, label: string) =>
    `<a href="${esc(href)}" style="display:inline-block;background:#7a5c1e;color:#ffffff;text-decoration:none;padding:12px 22px;border-radius:8px;margin:6px 8px 6px 0;font-size:14px">${esc(label)}</a>`;
  const body = `
    <p>Përshëndetje ${esc(opts.customerName)},</p>
    <p><strong>Pagesa juaj u konfirmua.</strong> Faleminderit! Ftesa juaj është tani aktive dhe mund ta ndani me mysafirët tuaj.</p>
    <table style="margin:8px 0;border-collapse:collapse">
      <tr><td style="padding:4px 12px 4px 0;color:#9a8a6a">Numri i porosisë</td><td style="font-weight:bold">${esc(opts.orderNumber)}</td></tr>
      <tr><td style="padding:4px 12px 4px 0;color:#9a8a6a">Paketa</td><td>${esc(opts.packageLabel)}</td></tr>
      <tr><td style="padding:4px 12px 4px 0;color:#9a8a6a">Shuma e paguar</td><td style="font-weight:bold">${esc(opts.amount)}</td></tr>
    </table>
    <p style="margin-top:20px">${btn(opts.invitationUrl, "Shiko ftesën publike")}${btn(opts.dashboardUrl, "Hap panelin e mysafirëve")}</p>
    <p style="font-size:14px;color:#6a5f4d">Nga paneli mund të ndiqni përgjigjet RSVP, të menaxhoni listën e mysafirëve dhe të shkarkoni ftesën si PDF.</p>
    ${opts.whatsapp ? `<p style="font-size:14px">Keni nevojë për ndihmë? Na shkruani në WhatsApp: <a href="https://wa.me/${esc(opts.whatsapp)}">+${esc(opts.whatsapp)}</a></p>` : ""}
  `;
  return { subject: "Pagesa u konfirmua – Ftesa juaj është aktive!", html: layout("Pagesa u konfirmua", body) };
}
