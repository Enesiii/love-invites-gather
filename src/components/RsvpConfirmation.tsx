import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Bell, Calendar, Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { downloadIcs, googleCalendarUrl, type WeddingEvent } from "@/lib/calendar";
import { locationHref } from "@/lib/invitation-location";
import { declinePush, recordCalendarChoice, savePushSubscription } from "@/lib/reminders.functions";
import { VAPID_PUBLIC_KEY } from "@/lib/site-config";

interface ConfirmationInvitation {
  id: string;
  partner_one: string;
  partner_two: string;
  event_date: string;
  event_time: string;
  venue: string;
  address: string | null;
}

type PushState =
  | "idle"
  | "busy"
  | "subscribed"
  | "declined"
  | "unsupported"
  | "open-in-new-tab"
  | "denied"
  | "error";

function urlBase64ToUint8Array(base64: string) {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const raw = atob((base64 + padding).replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from(raw, (c) => c.charCodeAt(0));
}

// Ekrani i konfirmimit pas RSVP: opsione kalendari + njoftime push (opsionale).
export function RsvpConfirmation({ inv, rsvpId, onClose }: { inv: ConfirmationInvitation; rsvpId: string; onClose: () => void }) {
  const recordChoice = useServerFn(recordCalendarChoice);
  const saveSubscription = useServerFn(savePushSubscription);
  const decline = useServerFn(declinePush);
  const [pushState, setPushState] = useState<PushState>("idle");

  const event: WeddingEvent = {
    partnerOne: inv.partner_one,
    partnerTwo: inv.partner_two,
    date: inv.event_date,
    time: inv.event_time,
    venue: inv.venue,
    address: inv.address,
    mapsUrl: locationHref(inv.venue, inv.address),
    invitationUrl: `${window.location.origin}/ftesa/${inv.id}`,
  };

  function onGoogleCalendar() {
    window.open(googleCalendarUrl(event), "_blank", "noopener,noreferrer");
    void recordChoice({ data: { rsvpId, choice: "google" } });
  }

  function onDownloadIcs() {
    downloadIcs(event);
    void recordChoice({ data: { rsvpId, choice: "ics" } });
  }

  async function onEnablePush() {
    setPushState("busy");
    try {
      if (!("Notification" in window) || !("serviceWorker" in navigator) || !("PushManager" in window)) {
        setPushState("unsupported");
        return;
      }
      if (window.top !== window.self) {
        setPushState("open-in-new-tab");
        return;
      }
      const permission = Notification.permission === "granted" ? "granted" : await Notification.requestPermission();
      if (permission !== "granted") {
        setPushState("denied");
        return;
      }
      const registration = await navigator.serviceWorker.register("/push-sw.js");
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY) as BufferSource,
      });
      const key = subscription.getKey("p256dh");
      const auth = subscription.getKey("auth");
      if (!key || !auth) throw new Error("missing keys");
      const toB64 = (buf: ArrayBuffer) =>
        btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
      await saveSubscription({
        data: {
          rsvpId,
          endpoint: subscription.endpoint,
          p256dh: toB64(key),
          auth: toB64(auth),
          userAgent: navigator.userAgent,
        },
      });
      setPushState("subscribed");
    } catch (err) {
      console.error("push subscribe failed", err);
      setPushState("error");
    }
  }

  async function onDeclinePush() {
    setPushState("declined");
    try {
      await decline({ data: { rsvpId } });
    } catch {
      // Refuzimi mbetet vendor edhe nëse ruajtja dështon.
    }
  }

  return (
    <div className="mt-4 space-y-5 text-center">
      <div>
        <h3 className="font-display text-2xl">Faleminderit për konfirmimin!</h3>
        <p className="mt-2 text-muted-foreground">
          Jemi të lumtur që do të jeni pjesë e ditës sonë të veçantë.
        </p>
      </div>

      <div className="rounded-lg border border-border bg-background/60 p-4">
        <p className="text-sm text-muted-foreground">
          Mos e harroni këtë ditë! Shtojeni dasmën në kalendarin tuaj dhe merrni kujtesa para eventit.
        </p>
        <div className="mt-3 grid gap-2">
          <Button type="button" variant="outline" className="min-h-11" onClick={onGoogleCalendar}>
            <Calendar className="h-4 w-4" /> Shto në Google Calendar
          </Button>
          <Button type="button" variant="outline" className="min-h-11" onClick={onDownloadIcs}>
            <Calendar className="h-4 w-4" /> Shto në Apple Calendar
          </Button>
          <Button type="button" variant="outline" className="min-h-11" onClick={onDownloadIcs}>
            <Download className="h-4 w-4" /> Shkarko për kalendar (.ics)
          </Button>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-background/60 p-4">
        <p className="text-sm text-muted-foreground">
          Dëshironi njoftime direkt në telefon? Do t'ju kujtojmë 10 dhe 3 ditë para dasmës — vetëm me lejen tuaj.
        </p>
        {pushState === "idle" || pushState === "busy" ? (
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <Button type="button" className="min-h-11" disabled={pushState === "busy"} onClick={() => void onEnablePush()}>
              <Bell className="h-4 w-4" /> {pushState === "busy" ? "Duke aktivizuar…" : "Aktivizo njoftimet"}
            </Button>
            <Button type="button" variant="ghost" className="min-h-11" onClick={() => void onDeclinePush()}>
              Jo, faleminderit
            </Button>
          </div>
        ) : (
          <p className="mt-3 text-sm" role="status">
            {pushState === "subscribed" && "Njoftimet u aktivizuan — do t'ju kujtojmë para dasmës. 🔔"}
            {pushState === "declined" && "Në rregull — nuk do të merrni njoftime."}
            {pushState === "unsupported" && "Shfletuesi juaj nuk mbështet njoftime push."}
            {pushState === "open-in-new-tab" && "Hapeni ftesën në një skedë të veçantë për të aktivizuar njoftimet."}
            {pushState === "denied" && "Leja për njoftime u refuzua. Mund ta ndryshoni te cilësimet e shfletuesit."}
            {pushState === "error" && "Njoftimet nuk u aktivizuan. Provoni përsëri më vonë."}
          </p>
        )}
      </div>

      <Button type="button" variant="ghost" size="sm" onClick={onClose}>
        <X className="h-4 w-4" /> Mbyll
      </Button>
    </div>
  );
}
