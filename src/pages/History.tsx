import { useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import { Card, CardContent } from "@/components/ui/card";

const History = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const timelineEvents = [
    {
      year: "1851",
      title: "The First America's Cup",
      description: "The schooner America, after which the trophy was named, won the Royal Yacht Squadron's 100 Guinea Cup...",
      image: "/public/images/The_America_Schooner_Yacht_-_New_York_Yacht_Club.jpg"
    },
    {
      year: "1983",
      title: "Australia II Breaks the Streak",
      description: "Australia II defeated Dennis Conner's Liberty to win the America's Cup...",
      image: "/public/images/AustraliaII.jpg"
    },
    {
      year: "2010",
      title: "The Era of Multihulls",
      description: "BMW Oracle Racing's USA-17, a 90-foot trimaran, defeated Alinghi's catamaran...",
      image: "/public/images/trimaranoOracle.jpg"
    },
    {
      year: "2013",
      title: "Oracle Team USA's Comeback",
      description: "Oracle Team USA completed one of the greatest comebacks in sports history...",
      image: "/public/images/2013_America's_Cup,_race.jpg"
    },
    {
      year: "2017",
      title: "New Zealand Takes the Cup",
      description: "Emirates Team New Zealand defeated Oracle Team USA to win the 35th America's Cup...",
      image: "/public/images/emirates-team-new-zealand-wins-america's-cup.jpg"
    },
    {
      year: "2021",
      title: "New Zealand Defends",
      description: "Emirates Team New Zealand successfully defended the America's Cup...",
      image: "/public/images/2021.jpg"
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <Hero 
        title="The History of America's Cup"
        subtitle="Explore the rich heritage of the world's oldest international sporting trophy, dating back to 1851."
        backgroundImage="/public/images/yyny.jpg"
      />

      <section className="section-padding bg-white">
        <div className="container-padding max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-center">A Legacy of Excellence</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            The America's Cup, affectionately known as the "Auld Mug," is the oldest international sporting trophy in the world...
          </p>
          <p className="text-gray-700 leading-relaxed">
            Throughout its storied history, the America's Cup has been a catalyst for innovation in sailing...
          </p>
        </div>
      </section>

      <section className="section-padding bg-gray-50">
        <div className="container-padding max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Key Moments in America's Cup History</h2>
          
          <div className="space-y-16">
            {timelineEvents.map((event, index) => (
              <Card key={event.year} className="border-none shadow-lg overflow-hidden">
                <div className={`grid grid-cols-1 md:grid-cols-2 ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                  <div className="aspect-video md:aspect-auto overflow-hidden">
                    <img 
                      src={event.image} 
                      alt={event.title} 
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                  </div>
                  <CardContent className="p-6 md:p-10 flex flex-col justify-center">
                    <div className="inline-block px-3 py-1 mb-4 bg-americas-teal/10 text-americas-teal text-sm font-medium rounded-full">
                      {event.year}
                    </div>
                    <h3 className="text-2xl font-bold mb-4">{event.title}</h3>
                    <p className="text-gray-700">{event.description}</p>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 37th America's Cup 2024 */}
      <section className="section-padding bg-white">
        <div className="container-padding max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">The 37<sup>th</sup> America's Cup – Barcelona 2024</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="rounded-xl overflow-hidden shadow-lg">
              <img 
                src="/images/ac37_barcelona.jpg" 
                alt="America's Cup 2024 Barcelona" 
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <p className="text-gray-700 leading-relaxed mb-4">
                The 37<sup>th</sup> America's Cup took place in <strong>Barcelona, Spain</strong>, and marked a thrilling new chapter in the event's prestigious legacy. <strong>Emirates Team New Zealand</strong>, the defending champions, successfully held off all challengers to retain the Cup in an intense and closely contested final.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                The competition showcased <strong>cutting-edge AC75 foiling monohulls</strong>, demonstrating once again the Cup's role as a catalyst for technological advancement in sailing. For the first time, the <strong>Youth and Women's America's Cup</strong> also took place, highlighting the growing commitment to inclusivity and the development of future talent in the sport.
              </p>
              <p className="text-gray-700 leading-relaxed">
                The event, held from <strong>August to October 2024</strong>, drew global attention and was widely praised for its spectacular racing, dynamic venue, and celebration of sailing innovation and tradition.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-americas-navy text-white" style={{
        backgroundImage: "linear-gradient(rgba(0, 51, 102, 0.85), rgba(0, 51, 102, 0.9)), url(https://images.unsplash.com/photo-1534270804882-6b5048b1c1fc?q=80&w=1400)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed"
      }}>
        <div className="container-padding max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">A Continuing Legacy</h2>
          <p className="opacity-90 mb-8">
            As we look toward future America's Cup competitions, the tradition of excellence, innovation, and fierce competition continues...
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default History;
