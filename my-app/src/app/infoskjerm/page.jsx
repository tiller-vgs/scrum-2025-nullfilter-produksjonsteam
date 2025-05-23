"use client";
import React, { useState, useEffect, useMemo } from "react";
import {
  Card,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

export default function InfoscreenPage() {
  // State
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [openingHours, setOpeningHours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [emblaApi, setEmblaApi] = useState(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [dailyOffer, setDailyOffer] = useState("");
  const [dailyOfferImage, setDailyOfferImage] = useState("");

  // Group products into pairs (stacked)
  // Group products into pairs (stacked) without duplication
  const columns = useMemo(() => {
    const pairs = [];
    // Create pairs without duplication
    for (let i = 0; i < products.length; i += 2) {
      // For the last item if there's an odd number of products
      if (i + 1 >= products.length) {
        pairs.push([products[i], null]);
      } else {
        pairs.push([products[i], products[i + 1]]);
      }
    }
    return pairs;
  }, [products]);

  const slides = useMemo(() => {
    const len = columns.length;
    return Array.from({ length: len }).map((_, i) => [
      columns[i],
      columns[(i + 1) % len],
      columns[(i + 2) % len],
    ]);
  }, [columns]);

  const navigateToDashboard = () => {
    router.push("/dashboard");
  };

  // Track slide index
  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setActiveSlide(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
    return () => emblaApi.off("select", onSelect);
  }, [emblaApi]);

  // Time updater
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Formatters & helpers
  const formatDate = () =>
    currentTime.toLocaleDateString("nb-NO", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  const formatTime = () =>
    currentTime.toLocaleTimeString("nb-NO", {
      hour: "2-digit",
      minute: "2-digit",
    });
  const isToday = (day) => {
    const days = [
      "Søndag",
      "Mandag",
      "Tirsdag",
      "Onsdag",
      "Torsdag",
      "Fredag",
      "Lørdag",
    ];
    return days[currentTime.getDay()] === day;
  };

  const renderProductCard = (product) => {
    if (!product) return <div className="h-[200px] bg-muted/20"></div>;

    return (
      <>
        <div className="relative h-[200px]">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://placehold.co/400x300?text=Produktbilde";
            }}
          />
          {product.promotion && (
            <Badge
              variant="destructive"
              className="absolute bottom-2 left-2 px-2 py-1 text-xs shadow-md"
            >
              {product.promotion}
            </Badge>
          )}
        </div>
        <CardContent className="p-3 flex flex-col h-[calc(100%-180px)]">
          <CardTitle className="text-lg mb-0">{product.name}</CardTitle>
          <CardDescription className="text-blackcoffee -sm mt-1">
            {product.description}
          </CardDescription>
        </CardContent>
      </>
    );
  };

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [prodRes, hoursRes] = await Promise.all([
          fetch("/api/products"),
          fetch("/api/opening-hours"),
          fetch("/api/daily-content"),
        ]);
        if (!prodRes.ok || !hoursRes.ok || !dailyContentRes.ok)
          throw new Error();
        setProducts(await prodRes.json());
        setOpeningHours(await hoursRes.json());

        const dailyContentData = await dailyContentRes.json();
        setDailyOffer(
          dailyContentData.currentOffer ||
            "Kjøp en kaffe, få en kanelbolle til halv pris!"
        );
        setDailyOfferImage(
          dailyContentData.offerImage || "/images/kanelbolle.png"
        );

        setError(null);
      } catch {
        setProducts([
          {
            id: 1,
            name: "Espresso",
            description: "Intens kaffe",
            price: "32kr",
            image: "/images/espresso.png",
          },
          {
            id: 2,
            name: "Cappuccino",
            description: "Espresso med melk",
            price: "45kr",
            image: "/images/cappuccino.png",
          },
          {
            id: 3,
            name: "Kanelbolle",
            description: "Nybakt kanelbolle",
            price: "35kr",
            image: "/images/kanelbolle.png",
            promotion: "2 for 50kr",
          },
          {
            id: 4,
            name: "Croissant",
            description: "Fransk croissant",
            price: "38kr",
            image: "/images/croissant.png",
          },
        ]);
        setOpeningHours([
          { day: "Mandag", hours: "09:30 - 12:00" },
          { day: "Tirsdag", hours: "09:30 - 12:00" },
          { day: "Onsdag", hours: "09:30 - 12:00" },
          { day: "Torsdag", hours: "09:30 - 12:00" },
          { day: "Fredag", hours: "Stengt" },
          { day: "Lørdag", hours: "Stengt" },
          { day: "Søndag", hours: "Stengt" },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 300_000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-primary mb-4">
            Laster inn...
          </h2>
          <p className="text-xl text-foreground/80">Vennligst vent.</p>
        </div>
      </div>
    );
  }

  return (
    <div data-page="infoscreen" className="min-h-screen bg-background">
      <div className="container mx-auto w-full flex flex-col">
        {error && (
          <div className=" bg-yellow-50 border-l-4 border-yellow-400 rounded-md text-yellow-700">
            {error}
          </div>
        )}
        <div className="mb-3">
          <div className="bg-coffee border-b-3 border-primary rounded-md shadow-md py-4 px-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="bg-primary text-latte p-3 rounded-md hidden sm:flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17 8h1a4 4 0 1 1 0 8h-1"></path>
                    <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"></path>
                    <line x1="6" y1="2" x2="6" y2="4"></line>
                    <line x1="10" y1="2" x2="10" y2="4"></line>
                    <line x1="14" y1="2" x2="14" y2="4"></line>
                  </svg>
                </div>
                <div>
                  <h1
                    className="text-3xl font-bold text-primary tracking-tight leading-none"
                    onClick={navigateToDashboard}
                  >
                    NullFilter Kafé
                  </h1>
                  <p className="text-sm font-bold text-coacoa hidden sm:block">
                    Din lokale kafé på Tiller VGS
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-5">
                <div className="text-right">
                  <div className="text-sm font-medium blackcoffee">
                    {formatDate()}
                  </div>
                  <div className="text-2xl font-bold text-primary">
                    {formatTime()}
                  </div>
                </div>
                <div className="hidden md:block border-l border-latte pl-4">
                  <div className="flex items-center gap-1.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
                    </svg>
                    <span className="text-sm font-medium">
                      Tiller VGS, 1. etasje
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Main Content */}
        <div className="grid grid-cols-3 grid-rows-1 lg:grid-cols-12 gap-2 flex-grow">
          {/* Products Carousel */}
          <div className="lg:col-span-8 flex flex-col">
            <h2 className="text-2xl md:text-3xl font-bold text-primary px-1">
              Produkter
            </h2>
            <div className="flex-grow relative">
              <Carousel
                plugins={[Autoplay({ delay: 5000 })]}
                opts={{
                  loop: true,
                  align: "start",
                  slidesToScroll: 1,
                  speed: 3,
                }}
                setApi={setEmblaApi}
                className="w-full h-full overflow-hidden"
              >
                {/* use gap+px on the track, basis-1/3 on each item */}
                <CarouselContent className="flex h-full gap-1 px-1">
                  {columns.map(([top, bottom], idx) => (
                    <CarouselItem
                      key={idx}
                      className="flex-shrink-0 basis-1/3 h-full drop-shadow-lg"
                    >
                      <div className="flex flex-col justify-between h-full space-y-1">
                        <Card className="border-3 border-border shadow-lg overflow-hidden">
                          {renderProductCard(top)}
                        </Card>
                        <Card className="border-3 border-border shadow-lg overflow-hidden">
                          {renderProductCard(bottom)}
                        </Card>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>

                {/* Slide counter */}
                <div className="absolute top-2 right-2 bg-coacoa bg-opacity-50 text-latte text-sm px-2 py-1 rounded">
                  {activeSlide + 1}/{columns.length}
                </div>
                {/* Indicators */}
                <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2">
                  {columns.map((_, i) => (
                    <div
                      key={i}
                      className={`h-2 rounded-full transition-all ${
                        i === activeSlide ? "w-6 bg-primary" : "w-2 bg-muted"
                      }`}
                    />
                  ))}
                </div>
              </Carousel>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 flex flex-col gap-2 h-full px-1">
            {/* Dagens tilbud */}
            <Card className="border-3 border-border shadow-lg overflow-hidden flex-grow">
              <div className="bg-latte p-3 h-8 flex flex-col">
                <div className="mb-2 drop-shadow-lg">
                  <h3 className="text-2xl font-bold text-primary">
                    Dagens tilbud 🔥
                  </h3>
                  <p className="text-base text-blackcoffee mt-2">
                    Kjøp en kaffe, få en kanelbolle til halv pris!
                  </p>
                </div>
                <div className="w-full flex-grow bg-latte rounded-lg overflow-hidden mt-2 shadow-md min-h-[180px]">
                  <img
                    src="/images/kanelbolle.png"
                    alt="Tilbud"
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://placehold.co/400x200?text=Tilbud";
                    }}
                  />
                </div>
              </div>
            </Card>

            {/* Opening hours */}
            <Card className="border-3 border-border shadow-lg mt-auto drop-shadow-lg">
              <CardTitle className="text-2xl font-bold text-primary text-center pt-3 pb-2">
                Åpningstider
              </CardTitle>
              <CardContent className="p-3">
                <div className="grid grid-cols-2 gap-y-2">
                  {openingHours.map((item) => (
                    <React.Fragment key={item.day}>
                      <div
                        className={`text-base font-medium ${
                          isToday(item.day) ? "text-primary font-bold" : ""
                        }`}
                      >
                        {item.day}
                      </div>
                      <div
                        className={`text-base text-right ${
                          isToday(item.day) ? "text-primary font-bold" : ""
                        }`}
                      >
                        {item.hours}
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        {/* Footer Carousel */}
        <div className="fixed bottom-0 left-0 right-0 bg-blackcoffee/90 text-latte shadow-[0_-2px_10px_rgba(0,0,0,0.1)] border-t-3 border-blackcoffee">
          <div className="container mx-auto max-w-[100%]">
            <Carousel
              plugins={[Autoplay({ delay: 8000 })]}
              opts={{ loop: true }}
              className="w-full"
            >
              <CarouselContent>
                <CarouselItem>
                  <p className="text-center text-xl md:text-2xl">
                    ☕ Kaffen vår er nymalt hver dag for best mulig smak
                  </p>
                </CarouselItem>
                <CarouselItem>
                  <p className="text-center text-xl md:text-2xl">
                    🍪 Alle bakevarer er hjemmelaget i vår egen kafé
                  </p>
                </CarouselItem>
                <CarouselItem>
                  <p className="text-center text-xl md:text-2xl">
                    🌱 Vi bruker kun økologiske og lokale råvarer
                  </p>
                </CarouselItem>
              </CarouselContent>
            </Carousel>
          </div>
        </div>
      </div>
    </div>
  );
}
