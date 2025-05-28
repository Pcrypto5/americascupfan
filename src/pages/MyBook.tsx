import { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

const MyBook = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [showPreview, setShowPreview] = useState(false);

    useEffect(() => {
      const handleKeyPress = (e: KeyboardEvent) => {
        if (showPreview) {
          const confirmation = confirm("Do you want to close the preview?");
          if (confirmation) {
            setShowPreview(false);
          }
        }
      };
      if (showPreview) {
        document.addEventListener("keydown", handleKeyPress);
      }
      return () => {
        document.removeEventListener("keydown", handleKeyPress);
      };
    }, [showPreview]);

  const chapters = [
    { number: "1", title: "Le Origini e la Storia" },
    { number: "2", title: "Il Trofeo delle Cento Ghinee: Simbolo di Supremazia Nautica" },
    { number: "3", title: "L'Era dei Grandi Schooner: 1870-1937" },
    { number: "4", title: "L'Epoca d'Oro delle Classi J: 1930-1937" },
    { number: "5", title: "Il Lungo Dominio Americano: 1958-1983" },
    { number: "7", title: "La Rivoluzione Australiana: 1983" },
    { number: "8 12", title: "Parte II: L'Evoluzione Tecnologica" },
    { number: "13 16", title: "Parte III: Le Grandi Personalità" },
    { number: "17 20", title: "Parte IV: Le Sedi e i Campi di Regata" },
    { number: "21 23", title: "Parte V: Le Controversie e le Battaglie Legali" },
    { number: "24 26", title: "Parte VI: L'Impatto Culturale e Economico" },
    { number: "27 29", title: "Parte VII: Il Futuro della Competizione" }
  ];

  const bookFeatures = [
    "I Finanziatori e i Mecenati: Il Ruolo dei Magnati nella Coppa",
    "New York e Newport: La Casa Storica della Coppa",
    "Il Deed of Gift: La Costituzione dell'America's Cup",
    "L'America's Cup come Evento Mediatico",
    "Le Sfide del XXI Secolo: Sostenibilità e Accessibilità",
    "Glossario dei Termini Tecnici"
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <Hero 
        title="Oltre la coppa c'è di più"
        subtitle="Storia, leggende e segreti della sfida velica più antica del mondo"
        backgroundImage="public/images/acqua-di-mare-profumo-1.jpg"
      />

      <section className="section-padding bg-white">
        <div className="container-padding max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <Badge className="bg-americas-teal mb-4">Versione in italiano</Badge>
            <h2 className="text-3xl font-bold mb-6">La guida definitiva alla Coppa America</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Immergetevi nella storia epica dell'America's Cup, la più antica e prestigiosa competizione velica al mondo. . Questo libro vi guida attraverso 170 anni di sfide, trionfi e innovazioni che hanno trasformato una semplice regata in un'ossessione globale.
            </p>
            <p className="text-gray-700 leading-relaxed mb-8">
              Incontrerete personaggi leggendari come Sir Thomas Lipton e Dennis Connerr, testimoni di rivoluzioni tecnologiche che hanno portato dalle barche in legno ai moderni monoscafi volanti. Vivrete l'emozione delle regate più avvincenti, dalle acque di Newport a quelle di Auckland.
            </p>

            <div className="flex flex-wrap gap-4">
              <a href="https://www.amazon.it/Oltre-coppa-c%C3%A8-pi%C3%B9-leggende/dp/B0DJDH1F7Q" target="_blank" rel="noopener noreferrer">
                <Button className="bg-americas-navy hover:bg-americas-navy/90">Ordina adesso</Button>
              </a>
              <Button variant="outline" onClick={() => setShowPreview(true)}>Preview Prefazione</Button>
            </div>

            {showPreview && (
              <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg w-full max-w-4xl h-[90vh] relative">
                  <button
                    onClick={() => setShowPreview(false)}
                    className="absolute top-2 right-2 text-sm bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded"
                  >
                    Close
                  </button>
                  <iframe 
                    src="/docs/prefazione.pdf" 
                    className="w-full h-full rounded-b-lg" 
                    title="Preview Prefazione"
                  ></iframe>
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <div className="aspect-[3/4] bg-gradient-to-br from-americas-navy to-americas-teal rounded-lg shadow-xl rotate-3">
              <img src="/images/cover-paolo.png" alt="Book Cover" className="w-full h-full object-cover rounded-lg" />
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-gray-50">
        <div className="container-padding max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-10 text-center">Nel libro troverai</h2>
          <div className="space-y-6">
            {chapters.map((chapter) => (
              <Card key={chapter.number} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-wrap justify-between gap-4">
                    <div>
                      <p className="text-americas-teal font-medium">Chapter {chapter.number}</p>
                      <h3 className="text-xl font-bold mb-2">{chapter.title}</h3>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-padding max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-10 text-center">Inoltre troverai</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {bookFeatures.map((feature, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="h-6 w-6 rounded-full bg-americas-teal text-white flex items-center justify-center shrink-0">✓</div>
                <p className="text-gray-700">{feature}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-americas-navy text-white">
        <div className="container-padding max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Reserve Your Copy Today</h2>
          <p className="opacity-90 mb-8">Contact us for the English version.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="https://www.amazon.it/Oltre-coppa-c%C3%A8-pi%C3%B9-leggende/dp/B0DJDH1F7Q" target="_blank" rel="noopener noreferrer">
              <Button className="bg-americas-teal hover:bg-americas-teal/90 px-8 py-6" size="lg">Ordina adesso</Button>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default MyBook;
