import Link from "next/link";
import { Percent, Lightbulb } from "lucide-react";

export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 md:py-5 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2.5 hover:opacity-90 transition-opacity"
        >
          <div className="bg-primary/10 p-2 md:p-2.5 rounded-full">
            <Percent className="h-6 w-6 md:h-7 md:w-7 text-primary" />
          </div>
          <span className="text-xl md:text-2xl font-extrabold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            할인도우미
          </span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link
            href="/tips"
            className="flex items-center gap-2 text-base md:text-lg font-medium hover:text-primary transition-colors px-3 py-2 rounded-md hover:bg-gray-50"
          >
            <Lightbulb className="h-5 w-5 md:h-6 md:w-6" />
            <span>꿀팁</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
