import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

interface Article {
  id: number;
  title: string;
  date: string;
  author: string;
  content: string;
}

const AllArticles = () => {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    fetch("/data/latest_articles.json")
      .then(res => res.json())
      .then(data => setArticles(data));
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="container-padding max-w-5xl mx-auto py-16 px-4">
        <h1 className="text-4xl font-bold text-center mb-12">All America's Cup Articles</h1>
        <div className="space-y-12">
          {articles.map(article => (
            <div key={article.id} className="bg-white rounded-xl p-6 shadow">
              <p className="text-sm text-gray-500 mb-1">{new Date(article.date).toUTCString()}</p>
              <h2 className="text-2xl font-semibold mb-2">{article.title}</h2>
              <p className="text-sm text-gray-600 mb-4">By {article.author}</p>
              <p className="text-base leading-relaxed whitespace-pre-line">{article.content}</p>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AllArticles;
