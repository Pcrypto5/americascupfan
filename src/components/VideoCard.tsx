import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface VideoCardProps {
  title: string;
  thumbnail: string; // può restare, ma non lo useremo ora
  duration: string;
  date: string;
  videoUrl: string;
}

const VideoCard = ({ title, duration, date, videoUrl }: VideoCardProps) => {
  return (
    <Card className="overflow-hidden border-none shadow-lg rounded-xl h-full flex flex-col">
      {/* EMBED VIDEO */}
      <div className="relative pt-[56.25%]">
        <iframe
          src={videoUrl.replace("watch?v=", "embed/")}
          className="absolute top-0 left-0 w-full h-full rounded-t-xl"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={title}
        ></iframe>
      </div>

      <CardContent className="p-4 flex-grow">
        <h3 className="font-medium text-lg line-clamp-2">{title}</h3>
        <p className="text-sm text-gray-500 mt-2">{date}</p>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button variant="outline" className="w-full" asChild>
          <a href={videoUrl} target="_blank" rel="noopener noreferrer">
            Guarda su YouTube
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default VideoCard;
