import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { ArrowUpRight, Heart, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function HomeNavigation() {
  const [open, setOpen] = useState(false);
  const items = [{ label: 'Koleksioni', id: 'koleksioni' }, { label: 'Si funksionon', id: 'si-funksionon' }, { label: 'Pyetje të shpeshta', id: 'pyetje' }];
  function go(id: string) {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  }
  return <header className="home-header">
    <div className="home-container home-nav">
      <Link to="/" className="home-brand font-display"><Heart className="h-5 w-5 fill-primary text-primary" /> Ftesa Dasme<span className="brand-period">.</span></Link>
      <nav className="home-desktop-nav" aria-label="Navigimi kryesor">{items.map(item => <Button key={item.id} variant="ghost" onClick={() => go(item.id)}>{item.label}</Button>)}</nav>
      <div className="home-nav-actions"><span className="home-locale">SQ / Kosovë</span><Button asChild className="home-cta nav-cta"><Link to="/krijo">Krijo ftesën <ArrowUpRight className="h-4 w-4" /></Link></Button><Button variant="ghost" size="icon" className="home-menu" aria-expanded={open} aria-label={open ? 'Mbyll menynë' : 'Hap menynë'} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</Button></div>
    </div>
    {open && <nav className="home-mobile-nav home-container" aria-label="Navigimi në telefon">{items.map(item => <Button key={item.id} variant="ghost" onClick={() => go(item.id)}>{item.label}</Button>)}</nav>}
  </header>;
}