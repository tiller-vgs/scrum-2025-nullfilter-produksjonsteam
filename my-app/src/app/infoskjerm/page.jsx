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
        
      </div>
    </div>
  );
}
