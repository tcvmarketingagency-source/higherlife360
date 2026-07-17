import type { Metadata } from 'next';
import { cache } from 'react';
import { notFound } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { ShareButton } from '@/components/sections/ShareButton';
import { SeriesRow } from '@/components/sections/SeriesRow';
import { supabase } from '@/lib/supabase';
import { getEmbedUrl } from '@/lib/video-embed';

export const dynamic = 'force-dynamic';

const getSermon = cache(async (id: string) => {
  const { data } = await supabase.from('sermons').select('*').eq('id', id).maybeSingle();
  return data;
});

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const sermon = await getSermon(params.id);

  if (!sermon) {
    return { title: 'Message Not Found' };
  }

  const description = sermon.description ?? `A message from ${sermon.speaker ?? 'HigherLife360'}.`;

  return {
    title: sermon.title,
    description,
    openGraph: {
      title: `${sermon.title} | HigherLife360`,
      description,
      type: 'video.other',
      images: sermon.thumbnail_url ? [{ url: sermon.thumbnail_url }] : undefined,
    },
  };
}

export default async function SermonDetailPage({ params }: { params: { id: string } }) {
  const sermon = await getSermon(params.id);
  if (!sermon) notFound();

  const embed = getEmbedUrl(sermon.video_url);

  const seriesName = sermon.series;
  const { data: moreFromSeries } = seriesName
    ? await supabase
        .from('sermons')
        .select('*')
        .eq('series', seriesName)
        .neq('id', sermon.id)
        .order('published_at', { ascending: false })
        .limit(8)
    : { data: [] };

  return (
    <main>
      <div className="bg-crimson-deep pt-24">
        <Container>
          <div className="relative aspect-video w-full overflow-hidden">
            {embed ? (
              <iframe
                src={embed.embedUrl}
                title={sermon.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 h-full w-full border-0"
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-crimson text-center">
                <p className="px-6 text-sm text-cream/70">
                  Video preview isn&apos;t available for this message yet.
                </p>
                {sermon.video_url && (
                  <a
                    href={sermon.video_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-sans text-sm font-semibold uppercase tracking-widest text-gold hover:text-gold-light"
                  >
                    Watch on External Site
                  </a>
                )}
              </div>
            )}
          </div>
        </Container>
      </div>

      <Section tone="cream">
        <Container>
          <div className="mx-auto max-w-3xl">
            {sermon.series && (
              <p className="text-eyebrow font-semibold uppercase text-gold">{sermon.series}</p>
            )}
            <h1 className="mt-3 font-display text-h1 font-semibold text-ink">{sermon.title}</h1>
            <p className="mt-3 font-sans text-xs uppercase tracking-widest text-ink/70">
              {[sermon.speaker, formatDate(sermon.published_at), sermon.duration]
                .filter(Boolean)
                .join(' · ')}
            </p>
            {sermon.scripture && <p className="mt-3 text-sm text-ink/70">{sermon.scripture}</p>}
            {sermon.description && (
              <p className="mt-6 text-body text-ink/80">{sermon.description}</p>
            )}

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <ShareButton title={sermon.title} />
              {/* PLACEHOLDER: wire up to real downloadable notes once available. */}
              <button
                type="button"
                disabled
                className="cursor-not-allowed border border-ink/20 px-8 py-3 font-sans text-sm font-medium uppercase tracking-[0.15em] text-ink/70"
              >
                Download Notes
              </button>
            </div>
          </div>
        </Container>
      </Section>

      {moreFromSeries && moreFromSeries.length > 0 && (
        <Section tone="crimson-deep">
          <Container>
            <SeriesRow title={`More from ${sermon.series}`} sermons={moreFromSeries} />
          </Container>
        </Section>
      )}
    </main>
  );
}
