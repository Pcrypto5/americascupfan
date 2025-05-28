import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ArticleCard from "../components/ArticleCard";

const AllArticles = () => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    fetch("/data/latest_articles.json")
      .then(res => res.json())
      .then(data => setArticles(data));
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="container-padding max-w-7xl mx-auto py-16">
        <h1 className="text-4xl font-bold text-center mb-12">All America's Cup News</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map(article => (
            <ArticleCard key={article.id} {...article} />
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AllArticles;
