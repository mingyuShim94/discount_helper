import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Calendar, User } from "lucide-react";
import { TIPS } from "@/lib/data/tips";
import { use } from "react";

interface TipPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: TipPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tip = TIPS.find((tip) => tip.slug === slug);

  if (!tip) {
    return {
      title: "꿀팁을 찾을 수 없습니다",
    };
  }

  return {
    title: `${tip.title} - 할인도우미 꿀팁`,
    description: tip.excerpt,
  };
}

export default function TipPage({ params }: TipPageProps) {
  const { slug } = use(params);
  const tip = TIPS.find((tip) => tip.slug === slug);

  if (!tip) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <article className="max-w-3xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-4">{tip.title}</h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {tip.author && (
              <div className="flex items-center gap-1.5">
                <User className="h-4 w-4" />
                <span>{tip.author}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              <span>
                {new Date(tip.publishedAt).toLocaleDateString("ko-KR")}
              </span>
            </div>
          </div>
        </header>

        <div className="prose prose-sm md:prose-base lg:prose-lg max-w-none">
          <div dangerouslySetInnerHTML={{ __html: tip.content }} />
        </div>
      </article>
    </div>
  );
}
