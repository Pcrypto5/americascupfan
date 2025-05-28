import { useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import { Button } from "@/components/ui/button";

const ComingSoon = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <Hero 
        title="Coming Soon  Follow this page and be part of something extraordinary."
        subtitle="Get ready for incredible updates, exclusive content, and behind-the-scenes access to the most thrilling edition of the America's Cup ever."
        backgroundImage="https://source.unsplash.com/photo-1469474968028-56623f02e42e"
      />

      {/* Countdown Section */}
      <section className="section-padding bg-white">
        <div className="container-padding max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-10">Countdown to the 38th America's Cup</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {["Days", "Hours", "Minutes", "Seconds"].map((unit) => (
              <div key={unit} className="flex flex-col items-center">
                <div className="bg-americas-navy text-white h-24 w-24 rounded-lg flex items-center justify-center text-4xl font-bold mb-2">
                  {unit === "Days" ? "138" : 
                   unit === "Hours" ? "07" : 
                   unit === "Minutes" ? "42" : "15"}
                </div>
                <span className="text-gray-600">{unit}</span>
              </div>
            ))}
          </div>

          <p className="mt-10 text-gray-600">
            The competition begins in Naples, Italy.
          </p>
        </div>
      </section>

      {/* Broadcast Info */}
      <section className="section-padding bg-americas-navy text-white">
        <div className="container-padding max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Where to Watch
          </h2>
          <p className="opacity-90 mb-8">
            All America's Cup events will be broadcast live on major sports networks worldwide and streamed on the official America's Cup website and app.
          </p>
          <Button 
            className="bg-americas-teal hover:bg-americas-teal/90"
          >
            View Broadcast Schedule
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ComingSoon;
