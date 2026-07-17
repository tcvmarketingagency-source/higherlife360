import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { NewsletterForm } from './NewsletterForm';

const quickLinks = [
  { label: 'Vision', href: '/vision' },
  { label: 'Live', href: '/live' },
  { label: 'Messages', href: '/recording' },
  { label: 'Branches', href: '/branches' },
  { label: 'Events', href: '/events' },
  { label: 'Give', href: '/donate' },
  { label: 'Join Us', href: '/join' },
];

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <path d="M14 8.5h2.5V5H14c-2.2 0-4 1.8-4 4v2H8v3.5h2V21h3.5v-6.5H16l.5-3.5h-3V9c0-.3.2-1 1-1Z" />
    </svg>
  );
}

function YoutubeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <rect x="3" y="6" width="18" height="12" rx="3" />
      <path d="M11 10l4 2-4 2v-4Z" fill="currentColor" stroke="none" />
    </svg>
  );
}

const socialLinks = [
  { label: 'Instagram', href: '#', Icon: InstagramIcon },
  { label: 'Facebook', href: '#', Icon: FacebookIcon },
  { label: 'YouTube', href: '#', Icon: YoutubeIcon },
];

export function Footer() {
  return (
    <footer className="border-t border-gold/20 bg-crimson-deep text-cream">
      <Container className="grid gap-12 py-16 md:grid-cols-12">
        <div className="md:col-span-4">
          <p className="font-display text-3xl font-semibold">
            HigherLife<span className="text-gold">360</span>
          </p>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream/70">
            Welcoming every soul home to faith, family, and purpose.
          </p>
          <div className="mt-6 flex gap-4">
            {socialLinks.map((social) => (
              <Link
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="flex h-9 w-9 items-center justify-center border border-gold/30 text-gold transition-colors hover:bg-gold hover:text-crimson-deep"
              >
                <social.Icon className="h-4 w-4" />
              </Link>
            ))}
          </div>
        </div>

        <div className="md:col-span-3">
          <p className="text-eyebrow font-semibold uppercase text-gold">Quick Links</p>
          <ul className="mt-4 space-y-3">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-cream/70 transition-colors hover:text-gold"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-5">
          <p className="text-eyebrow font-semibold uppercase text-gold">Stay Connected</p>
          <p className="mt-4 text-sm text-cream/70">
            Sign up for our newsletter to receive updates on messages and events.
          </p>
          <NewsletterForm />
        </div>
      </Container>

      <div className="border-t border-gold/10">
        <Container className="flex flex-col items-center justify-between gap-4 py-6 text-xs text-cream/70 md:flex-row">
          <p>&copy; {new Date().getFullYear()} HigherLife360. All rights reserved.</p>
          <p>123 Faith Avenue, Your City, ST 00000</p>
        </Container>
      </div>
    </footer>
  );
}
