import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import Reveal from './Reveal'
import { company, nav, services } from '../data/site'
import { mailHref, telHref } from '../lib/utils'

/** Underline that grows in from the left on hover, instead of a flat color swap. */
function FooterLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link to={to} className="group relative inline-block text-sm text-paper/70 transition-colors duration-300 hover:text-brand-lit">
      {children}
      <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-brand-lit transition-all duration-300 ease-[var(--ease-out-expo)] group-hover:w-full" />
    </Link>
  )
}

function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative overflow-hidden bg-ink text-paper">
      {/* Shimmering gradient line — always running, not scroll-triggered, so
          the footer has a bit of continuous life whenever it's on screen. */}
      <div className="footer-shimmer h-[3px] w-full" />

      {/* Slow drifting glow — the only place on the page the footer gets its own bit of depth */}
      <div className="drift pointer-events-none absolute -top-32 left-1/4 h-96 w-96 rounded-full brand-glow opacity-20 blur-3xl" />
      <div className="drift-alt pointer-events-none absolute -bottom-40 right-0 h-80 w-80 rounded-full bg-paper/5 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-20 md:grid-cols-4 md:px-10">
        <Reveal as="div" className="md:col-span-1">
          <p className="font-display text-2xl font-extrabold">
            Dynamic<span className="text-brand-lit">Delta</span>
          </p>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-paper/60">{company.tagline}</p>
          <p className="eyebrow mt-6 border-brand-lit/30 bg-brand-lit/10 text-brand-lit">
            Est. {company.founded} · Dubai
          </p>
        </Reveal>

        <Reveal as="div" delay={80} direction="left">
          <p className="text-xs font-bold uppercase tracking-wide text-brand-lit">Navigate</p>
          <ul className="mt-6 space-y-3">
            {nav.map((link) => (
              <li key={link.to}>
                <FooterLink to={link.to}>{link.label}</FooterLink>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal as="div" delay={160} direction="right">
          <p className="text-xs font-bold uppercase tracking-wide text-brand-lit">Divisions</p>
          <ul className="mt-6 space-y-3">
            {services.map((service) => (
              <li key={service.id}>
                <FooterLink to="/services">{service.title}</FooterLink>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal as="div" delay={240}>
          <p className="text-xs font-bold uppercase tracking-wide text-brand-lit">Contact</p>
          <address className="mt-6 space-y-4 text-sm not-italic text-paper/70">
            <p className="leading-relaxed">{company.address}</p>
            <p className="text-xs text-paper/50">{company.poBox}</p>
            <div>
              {company.phones.map((phone) => (
                <a
                  key={phone}
                  href={telHref(phone)}
                  className="block font-medium transition-colors duration-300 hover:text-brand-lit"
                >
                  {phone}
                </a>
              ))}
            </div>
            <a
              href={mailHref(company.email)}
              className="block transition-colors duration-300 hover:text-brand-lit"
            >
              {company.email}
            </a>
            <p className="text-xs text-paper/50">{company.hours}</p>
          </address>
        </Reveal>
      </div>

      <div className="relative border-t border-paper/10">
        {/* Plain mount-triggered fade, not scroll-triggered: this row sits at the
            document's absolute bottom edge, where a transform-based scroll-Reveal
            can never intersect the viewport while still in its pre-reveal offset
            (the offset itself pushes it just out of the reachable scroll range). */}
        <div className="footer-bar mx-auto flex max-w-7xl flex-col gap-3 px-6 py-6 text-xs text-paper/50 md:flex-row md:items-center md:justify-between md:px-10">
          <p>
            &copy; {year} {company.name}. All rights reserved.
          </p>
          <p className="font-semibold uppercase tracking-wide text-paper/60">
            Mechanical · Electrical · Plumbing
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
