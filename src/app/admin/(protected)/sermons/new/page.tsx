import type { Metadata } from 'next';
import { SermonForm } from '../SermonForm';

export const metadata: Metadata = { title: 'Add Sermon' };

export default function NewSermonPage() {
  return (
    <div>
      <h1 className="font-display text-h2 font-semibold text-ink">Add Sermon</h1>
      <div className="mt-8">
        <SermonForm />
      </div>
    </div>
  );
}
