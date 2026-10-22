import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Check, Clock, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { PRICING, whatsappUrl } from "@/lib/site-config";

export function HomePricing() {
  const { t } = useI18n();
  const wa = whatsappUrl();
  return (
    <section id="cmimet" className="home-section pricing-section" aria-labelledby="pricing-title">
      <div className="home-container">
        <div className="section-heading">
          <p className="home-eyebrow">{t.pricing.eyebrow}</p>
          <h2 id="pricing-title" className="font-display">
            {t.pricing.title} <em>{t.pricing.em}</em>
          </h2>
          <p>{t.pricing.desc}</p>
        </div>
        <div className="pricing-grid">
        {PRICING.packages.map((pkg) => (
          <article key={pkg.id} className={`pricing-card ${pkg.featured ? "is-featured" : ""}`}>
            <div className="pricing-head">
              <h3 className="font-display">{pkg.id === "premium" ? t.pricing.premiumName : t.pricing.name}</h3>
              <p className="pricing-price">
                <span>{t.pricing.from}</span>
                <strong className="font-display">
                  {PRICING.currency}
                  {pkg.price}
                </strong>
                <span>{t.pricing.per}</span>
              </p>
            </div>
            <ul>
              {(pkg.id === "premium" ? t.pricing.premiumFeatures : t.pricing.features).map((f) => (
                <li key={f}>
                  <Check className="h-4 w-4" aria-hidden="true" /> {f}
                </li>
              ))}
            </ul>
            <p className="pricing-active">
              <Clock className="h-4 w-4" aria-hidden="true" />
              {t.pricing.active.replace("{days}", String(PRICING.activeDaysAfterEvent))}
            </p>
            <div className="pricing-actions">
              <Button asChild size="lg" className="home-cta">
                <Link to="/krijo" search={pkg.id === "premium" ? { theme: "lux-gold" } : {}}>
                  {t.pricing.cta} <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
              {wa && (
                <Button asChild size="lg" variant="outline" className="home-secondary">
                  <a href={wa} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="h-4 w-4" /> {t.pricing.ask}
                  </a>
                </Button>
              )}
            </div>
            <p className="pricing-note">{t.pricing.note}</p>
          </article>
        ))}
        </div>
      </div>
    </section>
  );
}
