import { Link } from '@tanstack/react-router';
import { ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { invitationCollection } from '@/lib/invitation-collection';

export function HomeGallery() {
  return <div className="home-gallery">{invitationCollection.map((item, i) => <article key={item.id} className="collection-card">
    <Link to="/preview/$style" params={{ style: item.id }} className="collection-image" aria-label={`Shiko ftesën: ${item.name}`}>
      <img src={item.image} srcSet={`${item.small} 384w, ${item.image} 768w`} sizes="(max-width: 640px) calc(100vw - 40px), (max-width: 900px) 45vw, 360px" width={768} height={1024} loading="lazy" decoding="async" alt={`Ftesë dasme ${item.name.toLowerCase()}, me zarf dhe vulë zemre`} />
      <span className="collection-preview">Shiko ftesën <ArrowUpRight className="h-4 w-4" /></span>
    </Link>
    <div className="collection-meta"><span className="home-eyebrow">{item.category}</span><span className="collection-number">0{i + 1}</span></div>
    <h3 className="font-display"><Link to="/preview/$style" params={{ style: item.id }}>{item.name}</Link></h3>
    <p>{item.description}</p>
    <Button asChild variant="ghost" className="collection-link"><Link to="/preview/$style" params={{ style: item.id }}>Zbulo këtë stil <ArrowUpRight className="h-4 w-4" /></Link></Button>
  </article>)}</div>;
}