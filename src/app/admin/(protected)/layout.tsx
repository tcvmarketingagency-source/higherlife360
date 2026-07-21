import type { Metadata } from 'next';
import { requireAdmin } from '@/lib/admin-auth';
import { AdminShell } from '@/components/admin/AdminShell';

export const metadata: Metadata = {
  title: {
    template: '%s | HigherLife360 Admin',
    default: 'Admin',
  },
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

// Every /admin page (except /admin/login, /admin/auth/callback, and
// /admin/unauthorized, which live outside this layout's route group —
// see the folder structure) renders through here first. requireAdmin()
// redirects away before any page body or Server Action below it runs, so
// this is enforced on the server regardless of what the client shows.
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();

  return <AdminShell admin={admin}>{children}</AdminShell>;
}
