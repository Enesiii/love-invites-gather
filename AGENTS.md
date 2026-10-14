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
- `invitations` and `rsvps` tables have RLS on with no anon/authenticated policies; all access goes through server functions in `src/lib/invitations.functions.ts` using the admin client loaded inside handlers. Why: no accounts, so the secret `manage_token` must never be readable via the Data API.
- Owners view responses at `/menaxho/$token` (token = bearer secret); guests use public `/ftesa/$id`.
