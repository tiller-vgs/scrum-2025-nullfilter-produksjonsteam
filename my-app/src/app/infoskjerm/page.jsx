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
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

export default function InfoscreenPage() {
  // State for database data
  const [products, setProducts] = useState([]);
  const [openingHours, setOpeningHours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from database via API
  useEffect(() => {
    const fetchData = async () => {
      try {
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

        // Fallback to hardcoded data if API fails
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
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Laster inn...</h2>
          <p className="text-gray-500">Henter data fra databasen.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {error && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-700">
          {error}
        </div>
      )}

      {/* Title & Description - Kept hardcoded as requested */}
      <Card className="mb-10">
        <CardHeader>
          <CardTitle className="text-4xl font-bold">NullFilter Kafé</CardTitle>
          <CardDescription className="text-2xl text-gray-600">
            Velkommen til NullFilter - Din lokale kafé med hjemmelagde produkter
            og nybrent kaffe.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-15">
        {/* Product Carousel - takes up 2/3 of the width on medium screens and up */}
        <div className="md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Våre produkter</h2>
          <Carousel
            plugins={[
              Autoplay({
                delay: 3000,
              }),
            ]}
            opts={{
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {products.length > 0 ? (
                products.map((product) => (
                  <CarouselItem
                    key={product.id}
                    className="md:basis-1/2 lg:basis-1/3"
                  >
                    <Card>
                      <div className="relative">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-48 object-cover rounded-t-lg"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "https://placehold.co/400x300?text=Produktbilde";
                          }}
                        />
                        <div className="absolute top-2 right-2">
                          <div className="rounded-full bg-primary text-white px-4 py-1 text-sm font-medium">
                            {product.price}
                          </div>
                        </div>
                        {product.promotion && (
                          <div className="absolute bottom-2 left-2">
                            <Badge variant="destructive" className="text-sm">
                              {product.promotion}
                            </Badge>
                          </div>
                        )}
                      </div>
                      <CardContent className="pt-4">
                        <CardTitle className="text-lg">
                          {product.name}
                        </CardTitle>
                        <CardDescription>{product.description}</CardDescription>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))
              ) : (
                <CarouselItem className="text-center p-10">
                  Ingen produkter funnet
                </CarouselItem>
              )}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        </div>

        {/* Opening Hours Table - takes up 1/3 of the width on medium screens and up */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Åpningstider</h2>
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableCell className="font-medium">Dag</TableCell>
                    <TableCell>Tid</TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {openingHours.length > 0 ? (
                    openingHours.map((item) => (
                      <TableRow key={item.day}>
                        <TableCell className="font-medium">
                          {item.day}
                        </TableCell>
                        <TableCell
                          className={
                            item.hours === "Stengt" ? "text-red-500" : ""
                          }
                        >
                          {item.hours}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={2} className="text-center">
                        Ingen åpningstider funnet
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
