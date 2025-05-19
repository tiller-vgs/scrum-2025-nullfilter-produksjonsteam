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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-amber-50 to-amber-100">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4 text-primary">
            Laster inn...
          </h2>
          <p className="text-xl text-gray-700">
            Vennligst vent, henter informasjon.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-fixed pb-16"
      style={{
        backgroundImage: `
          linear-gradient(to bottom, rgba(255, 251, 235, 0.95), rgba(254, 243, 199, 0.9)),
          url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23805e3a' fill-opacity='0.06'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")
        `,
      }}
    >
      <div className="container mx-auto p-6">
        {error && (
          <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-md text-yellow-700 text-lg">
            {error}
          </div>
        )}

        {/* Improved Title & Description with Find Us moved to date area */}
        <div className="relative mb-10">
          <div className="bg-gradient-to-r from-primary to-primary/80 text-white p-8 rounded-lg shadow-2xl">
            <div className="flex flex-col md:flex-row justify-between items-start">
              <div>
                <h1 className="text-6xl font-bold tracking-tight">
                  NullFilter Kafé
                </h1>
                <p className="text-2xl mt-4 text-white/90 max-w-2xl">
                  Velkommen til NullFilter - Din lokale kafé med hjemmelagde
                  produkter og nybrent kaffe.
                </p>
              </div>

              {/* Date and Time Display with Find Us info */}
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-lg shadow-md mt-4 md:mt-0 min-w-[250px]">
                <div className="text-xl font-medium text-white">
                  {formatDate()}
                </div>
                <div className="text-4xl font-bold text-white mb-3">
                  {formatTime()}
                </div>

                {/*Removed*/}

                <div className="mt-2 pt-2 border-t border-white/30">
                  <h3 className="text-lg font-bold mb-1 text-white">
                    Finn oss
                  </h3>
                  <p className="text-white">Tiller VGS, 1. etasje</p>
                  <p className="text-white">Åpent for alle elever og ansatte</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main content with improved layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Left side content */}
          <div className="md:col-span-8">
            <h2 className="text-3xl font-bold mb-6 text-primary">
              Våre produkter
            </h2>
            <Carousel
              plugins={[
                Autoplay({
                  delay: 6000,
                }),
              ]}
              opts={{
                loop: true,
                align: "start",
                dragFree: false,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {products.length > 0 ? (
                  products.map((product) => (
                    <CarouselItem
                      key={product.id}
                      className="pl-2 md:pl-4 basis-full md:basis-1/2"
                    >
                      <Card className="border-0 shadow-xl overflow-hidden transition-all duration-300 h-full bg-white">
                        <div className="relative">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-[280px] object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src =
                                "https://placehold.co/400x300?text=Produktbilde";
                            }}
                          />
                          <div className="absolute top-4 right-4">
                            <div className="rounded-full bg-primary text-white px-6 py-2 text-xl font-medium shadow-md">
                              {product.price}
                            </div>
                          </div>
                          {product.promotion && (
                            <div className="absolute bottom-4 left-4">
                              <Badge
                                variant="destructive"
                                className="text-lg px-3 py-1.5 shadow-md"
                              >
                                {product.promotion}
                              </Badge>
                            </div>
                          )}
                        </div>
                        <CardContent className="pt-6 pb-6">
                          <CardTitle className="text-3xl mb-3">
                            {product.name}
                          </CardTitle>
                          <CardDescription className="text-xl">
                            {product.description}
                          </CardDescription>
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  ))
                ) : (
                  <CarouselItem className="text-center p-10">
                    <p className="text-xl">Ingen produkter funnet</p>
                  </CarouselItem>
                )}
              </CarouselContent>
            </Carousel>
          </div>

          {/* Right side content - More compact */}
          <div className="md:col-span-4">
            {/* Today's sale - Moved to the top for more visibility */}
            <Card className="border-0 shadow-xl mb-6 bg-gradient-to-r from-red-500 to-amber-500 text-white">
              <CardContent className="pt-6">
                <h3 className="text-2xl font-bold mb-2">Dagens tilbud 🔥</h3>
                <p className="text-lg mb-2 font-medium">
                  Kjøp en kaffe, få en kanelbolle til halv pris!
                </p>
              </CardContent>
            </Card>

            {/* Opening Hours - More compact */}
            <h2 className="text-3xl font-bold mb-4 text-primary">
              Åpningstider
            </h2>
            <Card className="border-0 shadow-xl bg-white">
              <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-1">
                  {openingHours.length > 0 ? (
                    openingHours.map((item) => (
                      <React.Fragment key={item.day}>
                        <div
                          className={`font-medium text-base py-1 px-2 ${
                            isToday(item.day)
                              ? "font-bold bg-primary/10 rounded-l"
                              : ""
                          }`}
                        >
                          {item.day}{" "}
                          {isToday(item.day) && (
                            <span className="text-primary">(I dag)</span>
                          )}
                        </div>
                        <div
                          className={`text-base py-1 px-2 ${
                            item.hours === "Stengt"
                              ? "text-red-500 font-semibold"
                              : ""
                          } ${
                            isToday(item.day)
                              ? "font-bold bg-primary/10 rounded-r"
                              : ""
                          }`}
                        >
                          {item.hours}
                        </div>
                      </React.Fragment>
                    ))
                  ) : (
                    <div className="col-span-2 text-center py-4">
                      Ingen åpningstider funnet
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer with auto-rotating messages */}
        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-primary to-primary/80 text-white py-4 mt-8 shadow-[0_-2px_10px_rgba(0,0,0,0.1)]">
          <div className="container mx-auto">
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
                  <p className="text-center text-2xl">
                    ☕ Kaffen vår er nymalt hver dag for best mulig smak
                  </p>
                </CarouselItem>
                <CarouselItem>
                  <p className="text-center text-2xl">
                    🍪 Alle bakevarer er hjemmelaget i vår egen kafé
                  </p>
                </CarouselItem>
                <CarouselItem>
                  <p className="text-center text-2xl">
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
