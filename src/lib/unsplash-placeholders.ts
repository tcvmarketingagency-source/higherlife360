// TEMPORARY STOCK PHOTOS — replace with real HigherLife360 photography (and,
// for the homepage hero, a real drone/interior video — see the comment block
// at the top of CinematicHero.tsx) once the client supplies it.
//
// Every URL below was individually downloaded and visually inspected before
// being added here — not just licence-checked — because Unsplash search
// results and even prior placeholder comments in this file have previously
// turned out to be wrong (a "cathedral" that was actually a London law
// court, a "congregation" that was actually a Hindu festival, a "community"
// photo that was actually an office). Do not add a new URL without doing the
// same: fetch the photo page, confirm "Free to use under the Unsplash
// License" (never an Unsplash+ / premium_photo-* URL), then download and
// look at the actual image before trusting its filename or search title.
//
// Source photos (photographer credit, though the Unsplash License requires
// no attribution) — one line per image so swapping in real photography is a
// one-line change per constant:

export const UNSPLASH_WORSHIP =
  'https://images.unsplash.com/photo-1776091104217-02e3732a4a81?q=80&w=1200&auto=format&fit=crop';
// Rod Long — hands raised in worship, pastor blurred on stage, lyrics projected.

export const UNSPLASH_CHURCH_INTERIOR =
  'https://images.unsplash.com/photo-1438032005730-c779502df39b?q=80&w=1200&auto=format&fit=crop';
// Sanctuary interior — stained glass, wooden pews, hanging lanterns.

export const UNSPLASH_CHURCH_EXTERIOR =
  'https://images.unsplash.com/photo-1580136926756-f4bb02d2b813?q=80&w=1200&auto=format&fit=crop';
// White wooden church building, cross-topped steeple, blue sky.

export const UNSPLASH_CHURCH_STEEPLE =
  'https://images.unsplash.com/photo-1663252910528-3983f20a3b59?q=80&w=1200&auto=format&fit=crop';
// Brick church steeple with cross against a clear sky.

export const UNSPLASH_CATHEDRAL_INTERIOR =
  'https://images.unsplash.com/photo-1776864926188-124eb99610e8?q=80&w=1200&auto=format&fit=crop';
// Grand cathedral interior — central aisle, altar, glowing stained glass.

export const UNSPLASH_STAINED_GLASS =
  'https://images.unsplash.com/photo-1758384077402-9bb1d74d29ef?q=80&w=1200&auto=format&fit=crop';
// Three stained glass windows depicting saints, church pews below.

export const UNSPLASH_WORSHIP_BAND =
  'https://images.unsplash.com/photo-1510384742052-1abcb6282645?q=80&w=1200&auto=format&fit=crop';
// Worshipper silhouette, hand raised, worship band and a stage cross behind — warm gold light.

export const UNSPLASH_WORSHIP_NIGHT =
  'https://images.unsplash.com/photo-1565804951749-2426372cdc74?q=80&w=1200&auto=format&fit=crop';
// Illuminated cross above a worship stage, dramatic light beams, singer performing.

export const UNSPLASH_WORSHIP_CROWD =
  'https://images.unsplash.com/photo-1565804903593-d0bdb8256894?q=80&w=1200&auto=format&fit=crop';
// Large illuminated stage cross, crowd silhouetted below — conference / worship-night scale.

export const UNSPLASH_SMALL_GROUP =
  'https://images.unsplash.com/photo-1609234656388-0ff363383899?q=80&w=1200&auto=format&fit=crop';
// Small group standing arm-in-arm in a prayer huddle, warm indoor light.

export const UNSPLASH_PRAYER =
  'https://images.unsplash.com/photo-1526746323784-6bc814d79273?q=80&w=1200&auto=format&fit=crop';
// Close-up, hands open in prayer at a youth gathering.

export const UNSPLASH_FELLOWSHIP =
  'https://images.unsplash.com/photo-1569292567777-e5d61a759322?q=80&w=1200&auto=format&fit=crop';
// A joyful group posing together at a church's stone archway entrance.

export const UNSPLASH_FAMILY_PEWS =
  'https://images.unsplash.com/photo-1682263557065-192c50c79d30?q=80&w=1200&auto=format&fit=crop';
// A mother holding her baby in warmly lit church pews, family around them.

export const UNSPLASH_OPEN_BIBLE =
  'https://images.unsplash.com/photo-1514902915413-c58ad04fd61e?q=80&w=1200&auto=format&fit=crop';
// An open Bible — the Gospel of John — by candlelight.

export const UNSPLASH_CANDLE =
  'https://images.unsplash.com/photo-1604745372175-27daa24a0a0e?q=80&w=1200&auto=format&fit=crop';
// A warmly candlelit open book, deep red/gold tones.

export const UNSPLASH_OUTREACH =
  'https://images.unsplash.com/photo-1628717341663-0007b0ee2597?q=80&w=1200&auto=format&fit=crop';
// Volunteers packing food bags for community outreach, outdoor canopy tent.

export const UNSPLASH_KIDS =
  'https://images.unsplash.com/photo-1765947384446-415f16df7b65?q=80&w=1200&auto=format&fit=crop';
// A young boy in a church pew during a service, family and congregation around him.

export const UNSPLASH_YOUTH =
  'https://images.unsplash.com/photo-1641337261712-3cb3f398331f?q=80&w=1200&auto=format&fit=crop';
// Casually dressed young worshippers, hands raised, modern industrial worship space.

export const UNSPLASH_WOMENS_GROUP =
  'https://images.unsplash.com/photo-1739301674016-45dddb02e2dd?q=80&w=1200&auto=format&fit=crop';
// Three women reading an open Bible together on a couch, laughing.

// PLACEHOLDER: an earlier version of this hero used a tightly-framed
// crucifix statue photo (photo-1648219889367-d97bee935598) — replaced
// because a subject filling ~80% of the frame vertically has no
// object-position that avoids cropping the head at some hero aspect ratio
// (verified by pixel-sampling: subject spanned ~28%-67% of frame height,
// meaning a widescreen crop needs a top-aligned 42%-tall window and an
// ultra-wide crop only a 32%-tall window — too tight a margin). The cross
// below has generous negative space around a compact, centered subject
// instead, which survives object-cover cropping at any aspect ratio.
export const UNSPLASH_CROSS_AURORA =
  'https://images.unsplash.com/photo-1769088243271-d4768cd60482?q=80&w=1200&auto=format&fit=crop';
// A cross silhouette centered between dark tree silhouettes, aurora borealis
// glowing behind it — compact, centered subject with vast dark sky/negative
// space on all sides. Verified via pixel-sampling: cross sits at ~48-55%
// horizontal (dead center) and ~28-85% vertical, well clear of crop zones
// at every realistic hero aspect ratio from ultra-wide to mobile portrait.

// ---------------------------------------------------------------------------
// Full-bleed hero-quality crops (same photos above, requested at a larger
// width) — for page heroes and other full-viewport background moments.
// ---------------------------------------------------------------------------

export const UNSPLASH_HERO_CHURCH_INTERIOR =
  'https://images.unsplash.com/photo-1438032005730-c779502df39b?q=80&w=2400&auto=format&fit=crop';

export const UNSPLASH_HERO_CROSS_AURORA =
  'https://images.unsplash.com/photo-1769088243271-d4768cd60482?q=80&w=2400&auto=format&fit=crop';

export const UNSPLASH_HERO_WORSHIP =
  'https://images.unsplash.com/photo-1776091104217-02e3732a4a81?q=80&w=2400&auto=format&fit=crop';

export const UNSPLASH_HERO_WORSHIP_BAND =
  'https://images.unsplash.com/photo-1510384742052-1abcb6282645?q=80&w=2400&auto=format&fit=crop';

export const UNSPLASH_HERO_SMALL_GROUP =
  'https://images.unsplash.com/photo-1609234656388-0ff363383899?q=80&w=2400&auto=format&fit=crop';

export const UNSPLASH_HERO_FELLOWSHIP =
  'https://images.unsplash.com/photo-1569292567777-e5d61a759322?q=80&w=2400&auto=format&fit=crop';

export const UNSPLASH_HERO_CATHEDRAL_INTERIOR =
  'https://images.unsplash.com/photo-1776864926188-124eb99610e8?q=80&w=2400&auto=format&fit=crop';

export const UNSPLASH_HERO_CHURCH_EXTERIOR =
  'https://images.unsplash.com/photo-1580136926756-f4bb02d2b813?q=80&w=2400&auto=format&fit=crop';

export const UNSPLASH_HERO_WORSHIP_CROWD =
  'https://images.unsplash.com/photo-1565804903593-d0bdb8256894?q=80&w=2400&auto=format&fit=crop';

export const UNSPLASH_HERO_WORSHIP_NIGHT =
  'https://images.unsplash.com/photo-1565804951749-2426372cdc74?q=80&w=2400&auto=format&fit=crop';

export const UNSPLASH_HERO_OPEN_BIBLE =
  'https://images.unsplash.com/photo-1514902915413-c58ad04fd61e?q=80&w=2400&auto=format&fit=crop';

export const UNSPLASH_HERO_CANDLE =
  'https://images.unsplash.com/photo-1604745372175-27daa24a0a0e?q=80&w=2400&auto=format&fit=crop';

export const UNSPLASH_HERO_FAMILY_PEWS =
  'https://images.unsplash.com/photo-1682263557065-192c50c79d30?q=80&w=2400&auto=format&fit=crop';

// ---------------------------------------------------------------------------
// Per-page hero backgrounds and fallback-photo pools.
// ---------------------------------------------------------------------------

// /branches hero background.
export const UNSPLASH_HERO_BACKGROUND = UNSPLASH_HERO_CHURCH_EXTERIOR;

// /events hero background.
export const UNSPLASH_EVENTS_HERO_BACKGROUND = UNSPLASH_HERO_WORSHIP_CROWD;

export const BRANCH_PHOTO_PLACEHOLDERS = [
  UNSPLASH_CHURCH_EXTERIOR,
  UNSPLASH_CHURCH_INTERIOR,
  UNSPLASH_CHURCH_STEEPLE,
  UNSPLASH_CATHEDRAL_INTERIOR,
  UNSPLASH_STAINED_GLASS,
  UNSPLASH_FELLOWSHIP,
];

export const EVENT_PHOTO_PLACEHOLDERS = [
  UNSPLASH_WORSHIP_NIGHT,
  UNSPLASH_WORSHIP_BAND,
  UNSPLASH_OUTREACH,
  UNSPLASH_WORSHIP,
  UNSPLASH_SMALL_GROUP,
  UNSPLASH_FELLOWSHIP,
];
