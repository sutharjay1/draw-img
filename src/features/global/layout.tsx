import { QueryProvider } from "@/providers/query-provider";
import { Separator } from "@/components/ui/separator";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <div className="flex h-full flex-col p-8">
        <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between gap-2 py-2 pr-4">
          <div className="flex items-center gap-2 px-4">
            <Separator orientation="vertical" className="mr-2 h-4" />
          </div>
        </header>
        <div className="flex h-full flex-1 flex-col gap-y-6 space-y-6 border-t border-zinc-200 p-4">
          {children}
        </div>
      </div>
    </QueryProvider>
  );
}
