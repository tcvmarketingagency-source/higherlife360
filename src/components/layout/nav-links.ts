export type NavLink =
  | { label: string; href: string; children?: never }
  | { label: string; href?: never; children: { label: string; href: string }[] };

export const navLinks: NavLink[] = [
  { label: 'Vision', href: '/vision' },
  {
    label: 'Watch',
    children: [
      { label: 'Live', href: '/live' },
      { label: 'Messages', href: '/recording' },
    ],
  },
  { label: 'Branches', href: '/branches' },
  { label: 'Events', href: '/events' },
  { label: 'About Us', href: '/about' },
  { label: 'Join Us', href: '/join' },
];
