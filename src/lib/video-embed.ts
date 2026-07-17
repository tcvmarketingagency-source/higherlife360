export type VideoEmbed = {
  provider: 'youtube' | 'vimeo' | 'facebook';
  embedUrl: string;
};

export function getEmbedUrl(videoUrl: string | null): VideoEmbed | null {
  if (!videoUrl) return null;

  let url: URL;
  try {
    url = new URL(videoUrl);
  } catch {
    return null;
  }

  const host = url.hostname.replace(/^www\./, '').replace(/^m\./, '');

  if (host === 'youtube.com') {
    const id = url.searchParams.get('v');
    if (id) return { provider: 'youtube', embedUrl: `https://www.youtube.com/embed/${id}` };

    const embedMatch = url.pathname.match(/^\/(embed|live|shorts)\/([a-zA-Z0-9_-]+)/);
    if (embedMatch) {
      return { provider: 'youtube', embedUrl: `https://www.youtube.com/embed/${embedMatch[2]}` };
    }
    return null;
  }

  if (host === 'youtu.be') {
    const id = url.pathname.replace('/', '');
    if (id) return { provider: 'youtube', embedUrl: `https://www.youtube.com/embed/${id}` };
    return null;
  }

  if (host === 'vimeo.com') {
    const idMatch = url.pathname.match(/\/(\d+)/);
    if (idMatch)
      return { provider: 'vimeo', embedUrl: `https://player.vimeo.com/video/${idMatch[1]}` };
    return null;
  }

  if (host === 'player.vimeo.com') {
    return { provider: 'vimeo', embedUrl: videoUrl };
  }

  // Facebook's Video Plugin accepts any Facebook video/live URL as the
  // `href` param — no need to extract a specific ID like YouTube/Vimeo.
  if (host === 'facebook.com' || host === 'm.facebook.com' || host === 'fb.watch') {
    return {
      provider: 'facebook',
      embedUrl: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(videoUrl)}&show_text=false`,
    };
  }

  return null;
}
