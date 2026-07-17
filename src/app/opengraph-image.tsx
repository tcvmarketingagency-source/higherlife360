import { ImageResponse } from 'next/og';

// Site-wide default OG image, generated on-brand (crimson/gold) so shared
// links always preview correctly even before a real branded graphic exists.
// PLACEHOLDER: replace with a real designed OG graphic (or real event/branch
// photography passed via a page's own openGraph.images) when available.

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// A font must be supplied explicitly here — relying on next/og's bundled
// default font fails during static generation on some platforms. Fetched via
// `new URL(..., import.meta.url)` (not node:fs) since this route runs on the
// edge runtime.
export default async function OpengraphImage() {
  const [regular, bold] = await Promise.all([
    fetch(new URL('./fonts/CormorantGaramond-SemiBold.ttf', import.meta.url)).then((res) =>
      res.arrayBuffer()
    ),
    fetch(new URL('./fonts/CormorantGaramond-Bold.ttf', import.meta.url)).then((res) =>
      res.arrayBuffer()
    ),
  ]);

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(160deg, #7A0C1F 0%, #5C0A18 100%)',
      }}
    >
      <div
        style={{
          display: 'flex',
          width: 120,
          height: 120,
          borderRadius: '50%',
          border: '2px solid rgba(201,162,75,0.6)',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 40,
        }}
      >
        <span style={{ fontSize: 48, fontFamily: 'Cormorant Garamond', color: '#C9A24B' }}>HL</span>
      </div>
      <div
        style={{
          display: 'flex',
          fontSize: 72,
          fontFamily: 'Cormorant Garamond',
          color: '#F5EFE0',
          fontWeight: 700,
        }}
      >
        HigherLife360
      </div>
      <div
        style={{
          display: 'flex',
          marginTop: 20,
          fontSize: 26,
          letterSpacing: 4,
          textTransform: 'uppercase',
          color: '#C9A24B',
        }}
      >
        Live a Higher Life
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: 'Cormorant Garamond', data: regular, weight: 400, style: 'normal' },
        { name: 'Cormorant Garamond', data: bold, weight: 700, style: 'normal' },
      ],
    }
  );
}
