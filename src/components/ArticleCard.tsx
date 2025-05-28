
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ArticleCardProps {
  title: string;
  excerpt: string;
  date: string;
  author: string;
  articleUrl: string;
}

const ArticleCard = ({ title, excerpt, date, author, articleUrl }: ArticleCardProps) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col justify-between h-full">
      <div className="p-6 flex flex-col flex-grow">
        <div className="text-sm text-green-600 mb-2">{date}</div>
        <h3 className="text-lg font-bold mb-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-4">{excerpt}</p>
        <p className="text-sm text-gray-500 mt-auto">By {author}</p>
      </div>
      <div className="p-4 pt-0">
        <a
          href={articleUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="outline" className="w-full">
            Read Article
          </Button>
        </a>
      </div>
    </div>
  );
};

export default ArticleCard;
