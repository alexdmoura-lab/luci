import { TopNav } from '@/components/chrome/top-nav';
import { BottomNav } from '@/components/chrome/bottom-nav';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TopNav />
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 sm:px-6 pt-2 pb-32 md:pb-12">
        {children}
      </main>
      <BottomNav />
    </>
  );
}
