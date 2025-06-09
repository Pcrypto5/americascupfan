import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Button } from "@/components/ui/button";

interface Article {
  id: number;
  title: string;
  date: string;
  author: string;
  articleUrl: string;
  image: string;
  content: string; // bilingual content separated by ###
}

const ArticlePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [language, setLanguage] = useState<'it' | 'en'>('it');

  useEffect(() => {
    fetch('/data/latest_articles.json')
      .then(res => res.json())
      .then((data: Article[]) => {
        const found = data.find(a => a.articleUrl.endsWith(slug || ''));
        setArticle(found || null);
      });
  }, [slug]);

  if (!article) {
    return <p className="text-center py-10">Articolo non trovato.</p>;
  }

  const [italian, english] = article.content.split('###').map(s => s.trim());

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container-padding max-w-3xl mx-auto py-16">
        <p className="text-sm text-gray-500 mb-2">{new Date(article.date).toUTCString()}</p>
        <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
        <p className="text-sm text-gray-600 mb-6">By {article.author}</p>

        <div className="flex gap-2 mb-6">
          <Button variant={language === 'it' ? 'default' : 'outline'} size="sm" onClick={() => setLanguage('it')}>IT</Button>
          <Button variant={language === 'en' ? 'default' : 'outline'} size="sm" onClick={() => setLanguage('en')}>EN</Button>
        </div>

        <article className="prose max-w-none whitespace-pre-line">
          {language === 'it' ? italian : english || italian}
        </article>

        <div className="mt-10">
          <Link to="/all-articles" className="text-americas-teal underline">
            ← Torna a tutti gli articoli
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ArticlePage;
