import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

// A font must be supplied explicitly here — relying on next/og's bundled
// default font fails during static generation on some platforms. Fetched via
// `new URL(..., import.meta.url)` (not node:fs) since this route runs on the
// edge runtime.
export default async function Icon() {
  const fontData = await fetch(
    new URL('./fonts/CormorantGaramond-SemiBold.ttf', import.meta.url)
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0F1523',
        color: '#E8A33D',
        fontSize: 18,
        fontFamily: 'Cormorant Garamond',
      }}
    >
      HL
    </div>,
    { ...size, fonts: [{ name: 'Cormorant Garamond', data: fontData, style: 'normal' }] }
  );
}
