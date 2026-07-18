import {
  UNSPLASH_KIDS,
  UNSPLASH_YOUTH,
  UNSPLASH_FELLOWSHIP,
  UNSPLASH_SMALL_GROUP,
  UNSPLASH_WOMENS_GROUP,
  UNSPLASH_FAMILY_PEWS,
  UNSPLASH_OPEN_BIBLE,
  UNSPLASH_WORSHIP_BAND,
  UNSPLASH_OUTREACH,
  UNSPLASH_PRAYER,
  UNSPLASH_CANDLE,
} from './unsplash-placeholders';

export type Ministry = {
  slug: string;
  audience: string;
  name: string;
  description: string;
  image: string;
};

// PLACEHOLDER — all 11 ministries below are a reasonable, common set for a
// church this size, but please confirm with the client: which of these
// HigherLife360 actually runs (per branch, they may vary), correct naming,
// age ranges, and meeting details. Treat this list as a strong starting
// draft, not confirmed fact.
export const ministries: Ministry[] = [
  {
    slug: 'kids',
    audience: 'Ages 0–12',
    name: 'HigherLife Kids',
    description:
      'A safe, fun, Bible-centered environment where kids discover God’s love from day one.',
    image: UNSPLASH_KIDS,
  },
  {
    slug: 'students',
    audience: 'Ages 13–18',
    name: 'HigherLife Students',
    description:
      'A place for teenagers to belong, ask real questions, and build a faith that’s truly their own.',
    image: UNSPLASH_YOUTH,
  },
  {
    slug: 'young-adults',
    audience: '20s & 30s',
    name: 'Young Adults',
    description:
      'Navigating career, relationships, and calling — together, with people who get it.',
    image: UNSPLASH_FELLOWSHIP,
  },
  {
    slug: 'mens',
    audience: 'Men',
    name: 'Men’s Discipleship',
    description: 'Real conversations, real accountability — men sharpening men for the long haul.',
    image: UNSPLASH_SMALL_GROUP,
  },
  {
    slug: 'womens',
    audience: 'Women',
    name: 'Women’s Discipleship',
    description: 'A warm, honest community of women growing in scripture and friendship together.',
    image: UNSPLASH_WOMENS_GROUP,
  },
  {
    slug: 'marriage-family',
    audience: 'Couples & Families',
    name: 'Marriage & Family',
    description: 'Practical, faith-rooted support and community for building a home that lasts.',
    image: UNSPLASH_FAMILY_PEWS,
  },
  {
    slug: 'small-groups',
    audience: 'Everyone',
    name: 'Small Groups',
    description: 'Life is better together — find a group that fits your season, wherever you are.',
    image: UNSPLASH_OPEN_BIBLE,
  },
  {
    slug: 'worship',
    audience: 'All Ages',
    name: 'Worship',
    description: 'Music and production that leads people into God’s presence, every single week.',
    image: UNSPLASH_WORSHIP_BAND,
  },
  {
    slug: 'missions-outreach',
    audience: 'Local & Global',
    name: 'Missions & Outreach',
    description:
      'Carrying HigherLife beyond our walls — serving our cities and reaching the nations.',
    image: UNSPLASH_OUTREACH,
  },
  {
    slug: 'prayer',
    audience: 'Everyone',
    name: 'Prayer',
    description: 'A community devoted to seeking God together, for our church and for one another.',
    image: UNSPLASH_PRAYER,
  },
  {
    slug: 'new-believers',
    audience: 'New Here',
    name: 'New Believers',
    description:
      'Just started your journey with Jesus? This is exactly where the next step begins.',
    image: UNSPLASH_CANDLE,
  },
];
