"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

export default function InfoscreenPage() {
  // State for database data
  const [products, setProducts] = useState([]);
  const [openingHours, setOpeningHours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Format date in Norwegian
  const formatDate = () => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return currentTime.toLocaleDateString("nb-NO", options);
  };

  // Format time in Norwegian
  const formatTime = () => {
    return currentTime.toLocaleTimeString("nb-NO", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Function to highlight today's opening hours
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

  // Fetch data from database via API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch implementation remains unchanged
        setLoading(true);

        // Fetch products
        const productsRes = await fetch("/api/products");
        if (!productsRes.ok) throw new Error("Failed to fetch products");
        const productsData = await productsRes.json();

        // Fetch opening hours
        const hoursRes = await fetch("/api/opening-hours");
        if (!hoursRes.ok) throw new Error("Failed to fetch opening hours");
        const hoursData = await hoursRes.json();

        // Update state with fetched data
        setProducts(productsData);
        setOpeningHours(hoursData);
        setError(null);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Kunne ikke hente data fra databasen. Bruker reserve-data.");

        // Fallback data remains unchanged
        setProducts([
          {
            id: 1,
            name: "Espresso",
            description: "En kraftfull kaffe med intensiv smak",
            price: "32kr",
            image: "/images/espresso.png",
          },
          {
            id: 2,
            name: "Cappuccino",
            description: "Espresso med dampet melk og melkeskum",
            price: "45kr",
            image: "/images/cappuccino.png",
          },
          {
            id: 3,
            name: "Kanelbolle",
            description: "Nybakt kanelbolle med sukker",
            price: "35kr",
            image: "/images/kanelbolle.png",
            promotion: "2 for 50kr",
          },
          {
            id: 4,
            name: "Croissant",
            description: "Fransk croissant med smør",
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

    // Refresh data every 5 minutes
    const refreshInterval = setInterval(fetchData, 300000);

    return () => clearInterval(refreshInterval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-background/50 to-background">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4 text-primary">
            Laster inn...
          </h2>
          <p className="text-xl text-foreground/80">
            Vennligst vent, henter informasjon.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div data-page="infoscreen" className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-4 max-w-[95%] w-full h-[calc(100vh-16px)] flex flex-col">
        {error && (
          <div className="mb-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-md text-yellow-700 text-lg">
            {error}
          </div>
        )}

        {/* Improved Title & Description with Find Us moved to date area */}
        <div className="mb-4">
          <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-6 rounded-lg shadow-xl">
            <div className="flex flex-col lg:flex-row justify-between items-start">
              <div>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                  NullFilter Kafé
                </h1>
                <p className="text-xl md:text-2xl mt-3 text-primary-foreground/90 max-w-2xl">
                  Velkommen til NullFilter - Din lokale kafé med hjemmelagde
                  produkter og nybrent kaffe.
                </p>
              </div>

              {/* Date and Time Display with Find Us info */}
              <div className="bg-card text-card-foreground p-4 rounded-lg shadow-md mt-4 lg:mt-0 min-w-[250px]">
                <div className="text-xl font-medium">{formatDate()}</div>
                <div className="text-3xl md:text-4xl font-bold mb-3">
                  {formatTime()}
                </div>

                <div className="mt-2 pt-2 border-t border-border">
                  <h3 className="text-lg font-bold mb-1">Finn oss</h3>
                  <p>Tiller VGS, 1. etasje</p>
                  <p>Åpent for alle elever og ansatte</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main content with improved layout - fill all available space */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-grow">
          {/* Left side content */}
          <div className="lg:col-span-9 flex flex-col">
            <h2 className="text-2xl md:text-3xl font-bold mb-3 text-primary">
              Våre produkter
            </h2>
            <div className="flex-grow">
              {products.length > 0 ? (
                <Carousel
                  plugins={[
                    Autoplay({
                      delay: 15000, // 15 seconds per slide
                    }),
                  ]}
                  opts={{
                    loop: true,
                    align: "start",
                    dragFree: false,
                  }}
                  className="w-full h-full"
                >
                  <CarouselContent className="h-full">
                    {/* Group products into chunks of 6 */}
                    {Array(Math.ceil(products.length / 6))
                      .fill()
                      .map((_, groupIndex) => (
                        <CarouselItem
                          key={`group-${groupIndex}`}
                          className="h-full basis-full pl-0"
                        >
                          <div className="grid grid-cols-3 grid-rows-2 gap-4 h-full">
                            {products
                              .slice(groupIndex * 6, (groupIndex + 1) * 6)
                              .map((product) => (
                                <div key={product.id} className="h-full">
                                  <Card className="border border-border shadow-lg overflow-hidden h-full">
                                    <div className="relative h-[140px]">
                                      <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                          e.target.onerror = null;
                                          e.target.src =
                                            "https://placehold.co/400x300?text=Produktbilde";
                                        }}
                                      />
                                      <div className="absolute top-2 right-2">
                                        <div className="rounded-full bg-primary text-primary-foreground px-3 py-1 text-sm font-medium shadow-md">
                                          {product.price}
                                        </div>
                                      </div>
                                      {product.promotion && (
                                        <div className="absolute bottom-2 left-2">
                                          <Badge
                                            variant="destructive"
                                            className="px-2 py-1 text-xs shadow-md"
                                          >
                                            {product.promotion}
                                          </Badge>
                                        </div>
                                      )}
                                    </div>
                                    <CardContent className="p-3 flex flex-col h-[calc(100%-140px)]">
                                      <CardTitle className="text-lg mb-1">
                                        {product.name}
                                      </CardTitle>
                                      <CardDescription className="text-sm flex-1">
                                        {product.description}
                                      </CardDescription>
                                    </CardContent>
                                  </Card>
                                </div>
                              ))}
                          </div>
                        </CarouselItem>
                      ))}
                  </CarouselContent>
                </Carousel>
              ) : (
                <div className="text-center p-10">
                  <p className="text-xl">Ingen produkter funnet</p>
                </div>
              )}
            </div>
          </div>

          {/* Right side content */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            {/* Today's sale - Moved to the top for more visibility */}
            <Card className="border-0 shadow-lg mb-0 bg-gradient-to-r from-destructive to-amber-500 text-white">
              <CardContent className="pt-4">
                <h3 className="text-2xl font-bold mb-2">Dagens tilbud 🔥</h3>
                <p className="text-lg mb-2 font-medium">
                  Kjøp en kaffe, få en kanelbolle til halv pris!
                </p>
              </CardContent>
            </Card>

            {/* Opening Hours */}
            <div className="flex-1 flex flex-col">
              <h2 className="text-2xl md:text-3xl font-bold mb-3 text-primary">
                Åpningstider
              </h2>
              <Card className="border border-border shadow-lg flex-1">
                <CardContent className="p-4 h-full">
                  <div className="grid grid-cols-2 gap-1 h-full">
                    {openingHours.length > 0 ? (
                      openingHours.map((item) => (
                        <React.Fragment key={item.day}>
                          <div
                            className={`font-medium ${
                              isToday(item.day) ? "text-primary font-bold" : ""
                            }`}
                          >
                            {item.day}
                          </div>
                          <div
                            className={`text-right ${
                              isToday(item.day) ? "text-primary font-bold" : ""
                            }`}
                          >
                            {item.hours}
                          </div>
                        </React.Fragment>
                      ))
                    ) : (
                      <p className="col-span-2 text-center">
                        Ingen åpningstider
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Footer with auto-rotating messages */}
        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-3 shadow-[0_-2px_10px_rgba(0,0,0,0.1)]">
          <div className="container mx-auto max-w-[95%]">
            <Carousel
              plugins={[
                Autoplay({
                  delay: 8000,
                }),
              ]}
              opts={{
                loop: true,
              }}
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
