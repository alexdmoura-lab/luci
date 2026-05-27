import { TopNav } from '@/components/chrome/top-nav';
import { BottomNav } from '@/components/chrome/bottom-nav';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TopNav />
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-6 pb-24 md:pb-10">
        {children}
      </main>
      <BottomNav />
    </>
  );
}
