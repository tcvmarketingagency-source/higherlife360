'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useToast } from '@/components/admin/ToastProvider';
import type { SiteImageGroup, SiteImageKeyDef } from '@/lib/site-image-keys';
import { ReplaceImageModal } from './ReplaceImageModal';
import { updateSiteImage } from './actions';

export function SiteImagesGrid({
  groups,
  imagesByKey,
}: {
  groups: Record<SiteImageGroup, SiteImageKeyDef[]>;
  imagesByKey: Record<string, string>;
}) {
  const router = useRouter();
  const toast = useToast();
  const [editingKey, setEditingKey] = useState<string | null>(null);

  async function handleReplace(def: SiteImageKeyDef, url: string) {
    const result = await updateSiteImage(def.key, url);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success(`${def.label} updated — live on the site now.`);
    setEditingKey(null);
    router.refresh();
  }

  const editingDef = editingKey
    ? Object.values(groups)
        .flat()
        .find((d) => d.key === editingKey)
    : null;

  return (
    <div className="space-y-12">
      {(Object.entries(groups) as [SiteImageGroup, SiteImageKeyDef[]][]).map(([group, defs]) => (
        <section key={group}>
          <h2 className="font-display text-h4 font-semibold text-ink">{group}</h2>
          <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {defs.map((def) => {
              const url = imagesByKey[def.key] ?? def.fallback;
              return (
                <div key={def.key} className="border border-ink/10 bg-white">
                  <div className="aspect-video w-full bg-ink/5">
                    {url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={url} alt={def.label} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-ink/40">
                        No image yet — using built-in placeholder
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="font-sans text-sm font-semibold text-ink">{def.label}</p>
                    <p className="mt-1 text-xs text-ink/60">{def.description}</p>
                    <button
                      type="button"
                      onClick={() => setEditingKey(def.key)}
                      className="mt-3 border border-gold px-4 py-2 text-xs font-semibold uppercase tracking-widest text-gold-deep transition-colors hover:bg-gold hover:text-navy"
                    >
                      Replace Image
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ))}

      {editingDef && (
        <ReplaceImageModal
          label={editingDef.label}
          onClose={() => setEditingKey(null)}
          onReplace={(url) => handleReplace(editingDef, url)}
        />
      )}
    </div>
  );
}
