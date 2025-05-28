
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface HeroProps {
  title: string;
  subtitle?: string;
  backgroundImage: string;
  buttonLabel?: string;
  buttonLink?: string;
}

const Hero = ({
  title,
  subtitle,
  backgroundImage,
  buttonLabel,
  buttonLink,
}: HeroProps) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <section 
      className="relative w-full h-[90vh] flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.4)), url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div 
        className={`container-padding max-w-5xl mx-auto text-center transition-all duration-1000 transform ${
          loaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}
      >
        <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-6 text-white tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto mb-8">
            {subtitle}
          </p>
        )}
        {buttonLabel && buttonLink && (
          <Button
            asChild
            className="bg-americas-teal hover:bg-americas-teal/90 text-white px-8 py-6 rounded-full text-base"
          >
            <a href={buttonLink}>{buttonLabel}</a>
          </Button>
        )}
      </div>
    </section>
  );
};

export default Hero;
