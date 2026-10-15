import { Heart } from "lucide-react";

export function ClosedInvitation({
  partnerOne,
  partnerTwo,
  theme,
}: {
  partnerOne: string;
  partnerTwo: string;
  theme: string;
}) {
  return (
    <div className={`theme-${theme} guest-invitation min-h-screen bg-background text-foreground`}>
      <main className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center px-6 text-center">
        <Heart className="mb-4 h-6 w-6 text-accent" strokeWidth={1} />
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Ftesa ka përfunduar</p>
        <h1 className="font-display mt-3 text-4xl sm:text-5xl">
          {partnerOne} & {partnerTwo}
        </h1>
        <p className="mt-5 text-muted-foreground">
          Faleminderit që ndatë me ne këtë ditë të veçantë. Kjo ftesë nuk pranon më përgjigje apo
          foto.
        </p>
      </main>
    </div>
  );
}
