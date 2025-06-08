import { useEffect, useState } from "react";
import Hero from "../components/Hero";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import VideoCard from "../components/VideoCard";
import ArticleCard, { Article } from "../components/ArticleCard";
import { Button } from "@/components/ui/button";

const Index = () => {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Cookie consent script initialization
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://cdn.jsdelivr.net/npm/cookieconsent@3/build/cookieconsent.min.css";
    document.head.appendChild(link);

    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/cookieconsent@3/build/cookieconsent.min.js";
    script.onload = () => {
      // @ts-ignore
      window.cookieconsent.initialise({
        palette: {
          popup: { background: "#002b45" },
          button: { background: "#00c2a8" }
        },
        theme: "classic",
        content: {
          message: "Utilizziamo i cookie per migliorare la tua esperienza sul sito.",
          dismiss: "Accetta",
          link: "Leggi di più",
          href: "/cookies"
        }
      });
    };
    document.body.appendChild(script);
  }, []);

  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    fetch("/data/latest_articles.json")
      .then(res => res.json())
      .then(data => setArticles(data))
      .catch(err => console.error("Errore nel caricamento degli articoli: ", err));
  }, []);

  const videos = [
    {
      id: 1,
      title: "America's Cup Race Day Highlights - Emirates Team New Zealand vs INEOS Team UK",
      thumbnail: "https://source.unsplash.com/photo-1482938289607-e9573fc25ebb",
      duration: "12:34",
      date: "March 15, 2023",
      videoUrl: "https://www.youtube.com/watch?v=D0_Csby53sI"
    },
    {
      id: 2,
      title: "AC75 Technology Explained: How These Boats Fly Above Water",
      thumbnail: "https://source.unsplash.com/photo-1469474968028-56623f02e42e",
      duration: "08:21",
      date: "February 28, 2023",
      videoUrl: "https://www.youtube.com/watch?v=VQUl_hf6yo8"
    },
    {
      id: 3,
      title: "The Evolution of America's Cup Boats Through History",
      thumbnail: "https://source.unsplash.com/photo-1518877593221-1f28583780b4",
      duration: "15:47",
      date: "January 12, 2023",
      videoUrl: "https://www.youtube.com/watch?v=I30FSVSdVhI"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <Hero 
        title="America's Cup Latest"
        subtitle="Stay updated with the latest news, videos, and stories from the world's premier sailing competition."
        backgroundImage="/images/napoli-notte-hd-1600x600.jpg"
        buttonLabel="Watch Highlights"
        buttonLink="#videos"
      />

      <section id="videos" className="section-padding bg-white">
        <div className="container-padding max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h4 className="text-sm text-americas-teal font-medium mb-2">WATCH</h4>
              <h2 className="text-3xl font-bold">Featured Videos</h2>
            </div>
            <Button variant="link" className="text-americas-navy">
              <a href="/watch-read">View All</a>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {videos.map(video => (
              <VideoCard 
                key={video.id}
                title={video.title}
                thumbnail={video.thumbnail}
                duration={video.duration}
                date={video.date}
                videoUrl={video.videoUrl}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-gray-50">
        <div className="container-padding max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h4 className="text-sm text-americas-teal font-medium mb-2">READ</h4>
              <h2 className="text-3xl font-bold">Latest Articles</h2>
            </div>
            <Button variant="link" className="text-americas-navy">
              <a href="/all-articles">View All</a>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.length > 0 ? (
              articles.map(article => (
                <ArticleCard key={article.id} article={article} />
              ))
            ) : (
              <p className="text-center col-span-3 text-gray-600">
                Loading latest articles...
              </p>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
