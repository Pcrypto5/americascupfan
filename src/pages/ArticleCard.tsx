// src/components/ArticleCard.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Definisci il tipo Article
export interface Article {
  id: number;
  title: string;
  date: string;
  author: string;
  content: string;
}

// L'interfaccia attende un unico prop `article`
interface ArticleCardProps {
  article: Article;
}

const ArticleCard = ({ article }: ArticleCardProps) => {
  const [language, setLanguage] = useState<"it" | "en">("it");
  // Dividi il contenuto bilingue in base al separatore ###
  const [contentIt, contentEn] = article.content.split("###");

  return (
    <Dialog>
      <div className="bg-white rounded-xl p-6 shadow">
        <p className="text-sm text-gray-500 mb-1">
          {new Date(article.date).toUTCString()}
        </p>
        <h2 className="text-xl font-semibold mb-2">{article.title}</h2>
        <p className="text-sm text-gray-600 mb-4">By {article.author}</p>

        <DialogTrigger asChild>
          <Button className="w-full">Read Article</Button>
        </DialogTrigger>

        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{article.title}</DialogTitle>
          </DialogHeader>
          <div className="flex justify-end gap-2 mb-4">
            <Button
              variant={language === "it" ? "default" : "outline"}
              size="sm"
              onClick={() => setLanguage("it")}
            >
              IT
            </Button>
            <Button
              variant={language === "en" ? "default" : "outline"}
              size="sm"
              onClick={() => setLanguage("en")}
            >
              EN
            </Button>
          </div>
          <div className="whitespace-pre-line text-sm leading-relaxed max-h-[60vh] overflow-y-auto">
            {language === "it"
              ? contentIt?.trim()
              : contentEn?.trim() || contentIt?.trim()}
          </div>
        </DialogContent>
      </div>
    </Dialog>
  );
};

export default ArticleCard;
