import { useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/use-toast";

const Subscribe = () => {
  const formRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const subscriptionPlans = [
    {
      name: "Basic",
      price: "Free",
      features: [
        "Weekly newsletter",
        "Race results summary",
        "Access to public articles",
        "Basic race analysis"
      ],
      recommended: false,
      buttonText: "Subscribe Now"
    },
    {
      name: "Premium",
      price: "$9.99/month",
      features: [
        "Everything in Basic",
        "Exclusive team interviews",
        "In-depth technical analysis",
        "HD race highlights",
        "Early access to content"
      ],
      recommended: true,
      buttonText: "Coming Soon"
    },
    {
      name: "Ultimate Fan",
      price: "$99/year",
      features: [
        "Everything in Premium",
        "Digital copy of 'My America's Cup Journey'",
        "Virtual meet & greets with experts",
        "Access to historical archive",
        "Exclusive merchandise discounts"
      ],
      buttonText: "Coming Soon"
    }
  ];

  const handleSubscribeForm = async (e: React.FormEvent) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const firstName = (form.querySelector('#first-name') as HTMLInputElement).value;
    const lastName = (form.querySelector('#last-name') as HTMLInputElement).value;
    const email = (form.querySelector('#email') as HTMLInputElement).value;

    const interests = Array.from(form.querySelectorAll('input[type="checkbox"]:checked'))
      .map((el) => (el as HTMLInputElement).value)
      .filter(val => val !== "on" && val !== "");

    const data = {
      firstName,
      lastName,
      email,
      interests,
    };

    try {
      const res = await fetch("https://americascupfan-production.up.railway.app/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      if (!res.ok) throw new Error("Errore nel salvataggio");

      toast({
        title: "Subscription submitted",
        description: "Thank you for subscribing! Your data has been saved.",
      });

      form.reset();
    } catch (err) {
      console.error("Errore durante l'invio:", err);
      toast({
        title: "Submission failed",
        description: "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <Hero 
        title=""
        subtitle=""
        backgroundImage="/images/JoinOurcommunity2.jpg"
      />

      {/* Subscription Plans */}
      <section className="section-padding bg-white">
        <div className="container-padding max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-4 text-center">Choose Your Plan</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-center mb-12">
            Select the subscription that best fits your level of passion for the America's Cup. Cancel anytime, no commitments.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {subscriptionPlans.map((plan) => (
              <Card 
                key={plan.name} 
                className={`border ${
                  plan.recommended 
                    ? "border-americas-teal shadow-lg shadow-americas-teal/10" 
                    : "border-gray-200"
                } transition-all hover:shadow-md`}
              >
                {plan.recommended && (
                  <div className="bg-americas-teal text-white text-center py-1 text-sm font-medium">
                    Recommended
                  </div>
                )}
                <CardHeader className="pt-6">
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                  <div className="mt-2">
                    <span className="text-3xl font-bold">{plan.price}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="h-5 w-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0 mt-0.5">
                          ✓
                        </div>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    className={`w-full ${plan.recommended 
                      ? "bg-americas-teal hover:bg-americas-teal/90" 
                      : "bg-americas-navy hover:bg-americas-navy/90"}`}
                    onClick={() => {
                      if (formRef.current) {
                        formRef.current.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                  >
                    {plan.buttonText}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Form */}
      <section ref={formRef} id="form" className="section-padding bg-gray-50">
        <div className="container-padding max-w-3xl mx-auto">
          <div className="bg-white shadow-lg rounded-xl p-8">
            <h2 className="text-2xl font-bold mb-6">Subscribe to Our Newsletter</h2>
            <p className="text-gray-600 mb-8">
              Stay updated with the latest America's Cup news, race results, and exclusive content delivered directly to your inbox.
            </p>

            <form onSubmit={handleSubscribeForm}>
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="first-name">First Name</Label>
                    <Input id="first-name" placeholder="John" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last-name">Last Name</Label>
                    <Input id="last-name" placeholder="Doe" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="john@example.com" required />
                </div>

                <div className="space-y-3">
                  <Label>I'm interested in</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {["Race results", "Technical analysis", "Team updates", "Historical content"].map((interest) => (
                      <div key={interest} className="flex items-center space-x-2">
                        <Checkbox 
                          id={interest.toLowerCase().replace(/\s+/g, '-')} 
                          value={interest} 
                        />
                        <label
                          htmlFor={interest.toLowerCase().replace(/\s+/g, '-')}
                          className="text-sm text-gray-700 cursor-pointer"
                        >
                          {interest}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <p className="text-sm text-gray-500">
                  We collect your data solely to send updates and personalized content. We never share your information with third parties.
                </p>

                <div className="flex items-start space-x-2 pt-2">
                  <Checkbox id="terms" required />
                  <label
                    htmlFor="terms"
                    className="text-sm text-gray-700"
                  >
                    I agree to receive emails from AmericasCupFan and understand that I can unsubscribe at any time. Read our{' '}
                    <a href="/privacy" className="underline text-americas-teal" target="_blank" rel="noopener noreferrer">Privacy Policy</a>.
                  </label>
                </div>

                <Button type="submit" className="w-full sm:w-auto bg-americas-navy hover:bg-americas-navy/90">
                  Subscribe Now
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Subscribe;
