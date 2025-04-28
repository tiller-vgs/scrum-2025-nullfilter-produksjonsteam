"use client";

import React from "react";
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
  // Sample opening hours data
  const openingHours = [
    { day: "Mandag", hours: "09:30 - 12:00" },
    { day: "Tirsdag", hours: "09:30 - 12:00" },
    { day: "Onsdag", hours: "09:30 - 12:00" },
    { day: "Torsdag", hours: "09:30 - 12:00" },
    { day: "Fredag", hours: "Stengt" },
    { day: "Lørdag", hours: "Stengt" },
    { day: "Søndag", hours: "Stengt" },
  ];

  // Sample product data
  const products = [
    {
      id: 1,
      name: "Espresso",
      description: "En kraftfull kaffe med intensiv smak",
      price: "32kr",
      image: "/images/espresso.png",
      promotion: null,
    },
    {
      id: 2,
      name: "Cappuccino",
      description: "Espresso med dampet melk og melkeskum",
      price: "45kr",
      image: "/images/cappuccino.png",
      promotion: null,
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
      promotion: null,
    },
  ];

  return (
    <div className="container mx-auto p-6">
      {/* Title & Description */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">NullFilter Kafé</CardTitle>
          <CardDescription className="text-base text-gray-600">
            Velkommen til NullFilter - Din lokale kafé med hjemmelagde produkter
            og nybrent kaffe.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
              {products.map((product) => (
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
                      <CardTitle className="text-lg">{product.name}</CardTitle>
                      <CardDescription>{product.description}</CardDescription>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
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
                  {openingHours.map((item) => (
                    <TableRow key={item.day}>
                      <TableCell className="font-medium">{item.day}</TableCell>
                      <TableCell
                        className={
                          item.hours === "Stengt" ? "text-red-500" : ""
                        }
                      >
                        {item.hours}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
