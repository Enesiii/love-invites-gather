import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { invitationCollection } from "@/lib/invitation-collection";
import { useI18n } from "@/lib/i18n";

export function HomeGallery() {
  const { t } = useI18n();
  return (
    <div className="home-gallery">
      {invitationCollection.map((item, i) => {
        const text = t.collection.styles[item.id];
        return (
          <article key={item.id} className="collection-card">
            <Link
              to="/preview/$style"
              params={{ style: item.id }}
              className="collection-image"
              aria-label={`${t.collection.aria}: ${item.name}`}
            >
              <img
                src={item.image}
                srcSet={`${item.small} 384w, ${item.image} 768w`}
                sizes="(max-width: 640px) calc(100vw - 40px), (max-width: 900px) 45vw, 360px"
                width={768}
                height={1024}
                loading={i < 2 ? "eager" : "lazy"}
                decoding="async"
                alt={`${t.collection.alt} — ${item.name}`}
              />
              <span className="collection-preview" aria-hidden="true">
                {t.collection.demo} <ArrowUpRight className="h-4 w-4" />
              </span>
            </Link>
            <div className="collection-meta">
              <span className="home-eyebrow">{text?.category ?? item.category}</span>
              <span className="collection-number">0{i + 1}</span>
            </div>
            <h3 className="font-display">{item.name}</h3>
            <p>{text?.description ?? item.description}</p>
            <p className="collection-features">{t.collection.details}</p>
            <Button asChild className="home-cta collection-demo">
              <Link to="/preview/$style" params={{ style: item.id }}>
                <Play className="h-4 w-4" aria-hidden="true" /> {t.collection.demo}
              </Link>
            </Button>
          </article>
        );
      })}
    </div>
  );
}
