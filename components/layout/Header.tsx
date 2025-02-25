import Link from "next/link";
import { Percent } from "lucide-react";

export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 hover:opacity-90 transition-opacity"
        >
          <div className="bg-primary/10 p-1.5 rounded-full">
            <Percent className="h-5 w-5 text-primary" />
          </div>
          <span className="text-xl font-extrabold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            할인도우미
          </span>
        </Link>
      </div>
    </header>
  );
}
