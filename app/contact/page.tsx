import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Mail, MessageCircle, Instagram } from "lucide-react";
import Link from "next/link";

export default function ContactPage() {
  const contactMethods = [
    {
      title: "카카오톡 오픈채팅",
      description: "카카오톡 오픈채팅방에서 실시간으로 문의하세요",
      icon: <MessageCircle className="w-6 h-6" />,
      href: "https://open.kakao.com/o/sX1Wzckh",
    },
    {
      title: "인스타그램",
      description: "인스타그램 DM으로 문의하세요",
      icon: <Instagram className="w-6 h-6" />,
      href: "https://www.instagram.com/discount_helper?igsh=bGhmb3U0Y2Vpcjky",
    },
    {
      title: "쓰레드",
      description: "쓰레드에서 소통해요",
      icon: <MessageCircle className="w-6 h-6" />,
      href: "https://www.threads.net/@discount_helper",
    },
    {
      title: "이메일",
      description: "gguggulab@gmail.com",
      icon: <Mail className="w-6 h-6" />,
      href: "mailto:gguggulab@gmail.com",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">연락하기</h1>
        <p className="text-muted-foreground">
          할인도우미에 문의하실 내용이 있다면 아래 채널들을 통해 연락해주세요.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
        {contactMethods.map((method, index) => (
          <Link
            href={method.href}
            key={index}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Card className="hover:bg-accent transition-colors cursor-pointer h-full">
              <CardHeader className="p-6">
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    {method.icon}
                  </div>
                  <div>
                    <CardTitle className="text-xl mb-1">
                      {method.title}
                    </CardTitle>
                    <CardDescription className="text-base">
                      {method.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
