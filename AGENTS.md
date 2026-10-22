<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Wedding invitations
- All invitation templates use InvitationLocation for venue links and location labels from the existing site language context; build search URLs from saved venue/address only. Why: consistent multilingual links without duplicate location fields or billable Maps APIs.
- `invitations` and `rsvps` tables have RLS on with no anon/authenticated policies; all access goes through server functions in `src/lib/invitations.functions.ts` using the admin client loaded inside handlers. Why: no accounts, so the secret `manage_token` must never be readable via the Data API.
- Owners view responses at `/menaxho/$token` (token = bearer secret); guests use public `/ftesa/$id`.
- Guest presentation is gated by a client-side envelope opening, with optional user-initiated Web Audio music and venue directions derived from existing invitation fields; this preserves the no-account RSVP data model without adding backend presentation settings.
- Scope homepage theme overrides to `.home-page` so presentation changes do not alter existing guest invitation palettes.
- Keep gallery samples in the browser-safe invitation collection module and preview them at `/preview/$style` without creating database rows; pass the selected theme to the existing creator through validated optional search parameters.
- Order requests from the preview page are stored in `order_requests` (RLS on, service_role only) via `submitOrderRequest` in `src/lib/orders.functions.ts`; no payment or pricing in-app. Why: keeps the no-account model and avoids inventing business terms.
- Optional accounts (email/Google) own invitations via `invitations.owner_id`; claiming requires the secret manage_token (`src/lib/account.functions.ts`, requireSupabaseAuth + admin client). Why: panel links stay valid while couples can recover them at `/ngjarjet`.
- AI invitation text goes through `generateInvitationText` (src/lib/ai-text.functions.ts) with gateway calls kept in `ai-text.server.ts`. Why: the API key and prompts stay server-side.
- Global invitation recovery in `/admin` uses `listAdminInvitations`, verifies the server-side ADMIN_KEY before privileged reads, and returns uncached paginated results; never expose management tokens through public listings. Why: administrators can recover client links without weakening invitation privacy.
- Business settings (WhatsApp number, pricing packages, active duration) live in `src/lib/site-config.ts`; homepage copy for all languages lives in `src/lib/i18n.tsx` (choice saved in localStorage). Why: owner can change prices/number/text in one place.
- All invitation design ids live in `src/lib/themes.ts` (classic + premium); validators import from it. Premium designs render via `PremiumInvitation` and use `invitations.cover_*` columns; couple photos are stored privately in the `event-photos` bucket, served only via short-lived signed URLs, validated server-side by magic bytes, authorized by manage_token. Guest/couple uploads appear publicly only when `event_photos.show_in_gallery` is set by the couple. Why: one source of truth and no public storage.
