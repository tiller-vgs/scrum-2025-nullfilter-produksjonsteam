"use client";

import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarDays, Quote } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  MoreHorizontal,
  Plus,
  Settings,
  Pencil,
  Trash2,
  Clock,
  Upload,
} from "lucide-react";
import { toast } from "sonner";

export default function DashboardPage() {
  // State for products and opening hours
  const [products, setProducts] = useState([]);
  const [openingHours, setOpeningHours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Dialog states
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [hoursDialogOpen, setHoursDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingDay, setEditingDay] = useState(null);

  // Add these state variables with your other states
  const [dailyContentImage, setDailyContentImage] = useState("");
  const [dailyContentPreviewImage, setDailyContentPreviewImage] = useState("");
  const [uploadingDailyImage, setUploadingDailyImage] = useState(false);

  // Image upload states
  const [uploadingImage, setUploadingImage] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  // Daily offer and quote states
  const [isDailyOffer, setIsDailyOffer] = useState(true);
  const [dailyOfferHistory, setDailyOfferHistory] = useState([]);
  const [dailyQuoteHistory, setDailyQuoteHistory] = useState([]);
  const [currentDailyOffer, setCurrentDailyOffer] = useState("");
  const [currentDailyQuote, setCurrentDailyQuote] = useState("");
  const [newDailyContent, setNewDailyContent] = useState("");

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

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

      // Fetch daily content
      const dailyContentRes = await fetch("/api/daily-content");
      if (!dailyContentRes.ok) throw new Error("Failed to fetch daily content");
      const dailyContentData = await dailyContentRes.json();

      setProducts(productsData);
      setOpeningHours(hoursData);

      // Set daily content data
      setDailyOfferHistory(dailyContentData.offers || []);
      setDailyQuoteHistory(dailyContentData.quotes || []);
      setCurrentDailyOffer(dailyContentData.currentOffer || "");
      setCurrentDailyQuote(dailyContentData.currentQuote || "");

      setError(null);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Kunne ikke hente data fra databasen");

      // Fallback to empty arrays
      setProducts([]);
      setOpeningHours([]);
      setDailyOfferHistory([]);
      setDailyQuoteHistory([]);
      setCurrentDailyOffer("");
      setCurrentDailyQuote("");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDailyContent = async () => {
    if (!newDailyContent.trim()) {
      toast.error("Tomt innhold", {
        description: "Skriv inn innhold før du lagrer.",
      });
      return;
    }

    try {
      const contentType = isDailyOffer ? "offer" : "quote";
      const res = await fetch("/api/daily-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: contentType,
          content: newDailyContent,
          image: dailyContentImage, // Add the image URL
        }),
      });

      if (!res.ok) throw new Error(`Failed to save daily ${contentType}`);

      const updatedContent = await res.json();

      // Update local state based on content type
      if (isDailyOffer) {
        setDailyOfferHistory(updatedContent.offers);
        setCurrentDailyOffer(newDailyContent);
      } else {
        setDailyQuoteHistory(updatedContent.quotes);
        setCurrentDailyQuote(newDailyContent);
      }

      // Clear form
      setNewDailyContent("");
      setDailyContentImage("");
      setDailyContentPreviewImage("");

      toast.success("Innhold lagret", {
        description: `Dagens ${
          isDailyOffer ? "tilbud" : "sitat"
        } har blitt oppdatert.`,
      });
    } catch (error) {
      console.error("Error saving daily content:", error);
      toast.error("Feil", {
        description: "Kunne ikke lagre innholdet.",
      });
    }
  };

  const handleDailyContentImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setUploadingDailyImage(true);

      // Create form data for upload
      const formData = new FormData();
      formData.append("file", file);

      // Upload the image
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await response.json();

      // Convert relative path to absolute URL if necessary
      const imageUrl = data.filePath.startsWith("http")
        ? data.filePath
        : new URL(data.filePath, window.location.origin).toString();

      // Set the image URL in state
      setDailyContentImage(imageUrl);
      setDailyContentPreviewImage(imageUrl);

      toast.success("Bilde lastet opp", {
        description: "Bildet ditt har blitt lastet opp",
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Opplasting feilet", {
        description: "Kunne ikke laste opp bildet. Vennligst prøv igjen.",
      });
    } finally {
      setUploadingDailyImage(false);
    }
  };

  // Product form schema
  const productFormSchema = z.object({
    name: z.string().min(2, "Navn må ha minst 2 tegn"),
    description: z.string().min(10, "Beskrivelse må ha minst 10 tegn"),
    price: z.string().min(2, "Pris er påkrevd"),
    image: z.string().min(1, "Bilde er påkrevd"),
    promotion: z.string().optional(),
  });

  // Opening hours form schema
  const hoursFormSchema = z.object({
    hours: z.string().min(1, "Timer er påkrevd"),
  });

  const handleSelectHistoryItem = (value) => {
    setNewDailyContent(value);
  };

  // Form setup for products
  const productForm = useForm({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      image: "",
      promotion: "",
    },
  });

  // Form setup for opening hours
  const hoursForm = useForm({
    resolver: zodResolver(hoursFormSchema),
    defaultValues: {
      hours: "",
    },
  });

  // Handle image upload
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setUploadingImage(true);

      // Create form data for upload
      const formData = new FormData();
      formData.append("file", file);

      // Upload the image
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await response.json();

      // Convert relative path to absolute URL if necessary
      const imageUrl = data.filePath.startsWith("http")
        ? data.filePath
        : new URL(data.filePath, window.location.origin).toString();

      // Set the image URL in the form and preview
      productForm.setValue("image", imageUrl);
      setPreviewImage(imageUrl);

      toast.success("Bilde lastet opp", {
        description: "Bildet ditt har blitt lastet opp",
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Opplasting feilet", {
        description: "Kunne ikke laste opp bildet. Vennligst prøv igjen.",
      });
    } finally {
      setUploadingImage(false);
    }
  };

  // Handle product edit
  const handleEditProduct = (product) => {
    setEditingProduct(product);
    productForm.reset({
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image,
      promotion: product.promotion || "",
    });
    setPreviewImage(product.image); // Set preview image when editing
    setProductDialogOpen(true);
  };

  // Handle product add
  const handleAddProduct = () => {
    setEditingProduct(null);
    productForm.reset({
      name: "",
      description: "",
      price: "",
      image: "",
      promotion: "",
    });
    setPreviewImage(""); // Clear preview image when adding new
    setProductDialogOpen(true);
  };

  const handleDeleteProduct = async (id) => {
    setProducts(products.filter((product) => product.id !== id));
    if (!confirm("Er du sikker på at du vil slette dette produktet?")) return;

    try {
      console.log(`Attempting to delete product with ID: ${id}`);

      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      console.log(`Delete request status: ${res.status}`);

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error("Error response:", errorData);
        throw new Error(
          `Failed to delete product: ${errorData.error || res.statusText}`
        );
      }

      // Remove product from state
      setProducts(products.filter((product) => product.id !== id));
      await fetchData();
      toast.success("Produkt slettet", {
        description: "Produktet har blitt fjernet",
      });
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Feil", {
        description: error.message || "Kunne ikke slette produkt",
      });
    }
  };

  const initializeOpeningHours = async () => {
    try {
      const res = await fetch("/api/opening-hours", {
        method: "POST",
      });

      if (!res.ok) throw new Error("Failed to initialize opening hours");

      const initializedHours = await res.json();
      setOpeningHours(initializedHours);
      toast.success("Åpningstider initialisert", {
        description: "Standard åpningstider har blitt satt",
      });
    } catch (error) {
      console.error("Error initializing hours:", error);
      toast.error("Feil", {
        description: "Kunne ikke initialisere åpningstider",
      });
    }
  };

  // Handle opening hours edit
  const handleEditHours = (day) => {
    setEditingDay(day);
    hoursForm.reset({
      hours: day.hours,
    });
    setHoursDialogOpen(true);
  };

  // Handle product form submission
  const onProductSubmit = async (data) => {
    try {
      if (editingProduct) {
        // Update existing product
        const res = await fetch(`/api/products/${editingProduct.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!res.ok) throw new Error("Failed to update product");

        const updatedProduct = await res.json();
        setProducts(
          products.map((product) =>
            product.id === editingProduct.id ? updatedProduct : product
          )
        );
        toast.success("Produkt oppdatert", {
          description: "Endringene dine har blitt lagret",
        });
      } else {
        // Add new product
        const res = await fetch("/api/products", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!res.ok) throw new Error("Failed to add product");

        const newProduct = await res.json();
        setProducts([...products, newProduct]);
        toast.success("Produkt lagt til", {
          description: "Nytt produkt har blitt lagt til i menyen din",
        });
      }

      setProductDialogOpen(false);
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error("Feil", {
        description: "Kunne ikke lagre produkt",
      });
    }
  };

  // Handle opening hours form submission
  const onHoursSubmit = async (data) => {
    try {
      const res = await fetch(`/api/opening-hours/${editingDay.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ hours: data.hours }),
      });

      if (!res.ok) throw new Error("Failed to update opening hours");

      const updatedHours = await res.json();
      setOpeningHours(
        openingHours.map((item) =>
          item.id === editingDay.id ? updatedHours : item
        )
      );

      setHoursDialogOpen(false);
      toast.success("Åpningstider oppdatert", {
        description: `Timer for ${editingDay.day} har blitt oppdatert`,
      });
    } catch (error) {
      console.error("Error updating hours:", error);
      toast.error("Feil", {
        description: "Kunne ikke oppdatere åpningstider",
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Laster...</h2>
          <p className="text-gray-500">Henter data fra database.</p>
        </div>
      </div>
    );
  }

  return (
    <div class="dashboard" className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Kafé Dashbord</h1>
        <Button variant="outline" onClick={fetchData}>
          Oppdater data
        </Button>
        <Button
          variant="default"
          onClick={() => (window.location.href = "/infoskjerm")}
        >
          <Settings className="mr-2 h-4 w-4" /> Gå til infoskjerm
        </Button>
      </div>
      {error && (
        <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-md text-red-700">
          {error}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Products Management */}
        <div className="md:col-span-2">
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Produkter</CardTitle>
                <CardDescription>Administrer kaféens produkter</CardDescription>
              </div>
              <Button onClick={handleAddProduct}>
                <Plus className="mr-2 h-4 w-4" /> Legg til produkt
              </Button>
            </CardHeader>
            <CardContent>
              {products.length > 0 ? (
                <div className="space-y-2">
                  {products.map((product) => (
                    <Card key={product.id} className="overflow-hidden">
                      <div className="flex justify-between items-center px-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <h3 className="font-medium">{product.name}</h3>
                            <p className="text-xs text-gray-500 line-clamp-1 max-w-[70%]">
                              {product.description}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">
                              {product.price}
                            </span>
                            {product.promotion && (
                              <span className="bg-red-100 text-red-800 text-xs px-1.5 py-0.5 rounded">
                                {product.promotion}
                              </span>
                            )}
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Åpne meny</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleEditProduct(product)}
                            >
                              <Pencil className="mr-2 h-4 w-4" /> Rediger
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDeleteProduct(product.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" /> Slett
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  <p>
                    Ingen produkter funnet. Legg til ditt første produkt med
                    knappen over.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Opening Hours Management */}
        <div>
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Åpningstider</CardTitle>
                <CardDescription>
                  Administrer kaféens åpningstider
                </CardDescription>
              </div>
              <Button variant="outline" onClick={initializeOpeningHours}>
                Tilbakestill til standard
              </Button>
            </CardHeader>
            <CardContent>
              {openingHours.length > 0 ? (
                <div className="space-y-2">
                  {openingHours.map((day) => (
                    <div
                      key={day.id}
                      className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-md"
                    >
                      <div>
                        <p className="font-medium">{day.day}</p>
                        <p
                          className={
                            day.hours === "Stengt"
                              ? "text-red-500 text-sm"
                              : "text-sm"
                          }
                        >
                          {day.hours}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditHours(day)}
                      >
                        <Clock className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <p>Ingen åpningstider definert.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      {/* Daily Offer/Quote Section */}
      <div className="md:col-span-3 mt-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Dagens innhold</CardTitle>
              <CardDescription>
                Administrer dagens tilbud eller sitat
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <CalendarDays
                className={`h-4 w-4 ${
                  isDailyOffer ? "text-primary" : "text-gray-400"
                }`}
              />
              <Switch
                checked={!isDailyOffer}
                onCheckedChange={(checked) => setIsDailyOffer(!checked)}
              />
              <Quote
                className={`h-4 w-4 ${
                  !isDailyOffer ? "text-primary" : "text-gray-400"
                }`}
              />
              <span className="text-sm font-medium ml-2">
                {isDailyOffer ? "Dagens tilbud" : "Dagens sitat"}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-gray-50 p-3 rounded-md border">
                <p className="text-sm font-medium mb-1">
                  {isDailyOffer ? "Nåværende tilbud:" : "Nåværende sitat:"}
                </p>
                <p className="italic">
                  {isDailyOffer
                    ? currentDailyOffer || "Ingen tilbud satt"
                    : currentDailyQuote || "Ingen sitat satt"}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Velg fra historikk:
                </label>
                <Select onValueChange={handleSelectHistoryItem}>
                  <SelectTrigger>
                    <SelectValue placeholder="Velg tidligere innhold..." />
                  </SelectTrigger>
                  <SelectContent>
                    {(isDailyOffer ? dailyOfferHistory : dailyQuoteHistory).map(
                      (item, index) => (
                        <SelectItem key={index} value={item}>
                          {item.length > 40
                            ? item.substring(0, 40) + "..."
                            : item}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label htmlFor="newContent" className="text-sm font-medium">
                  Nytt {isDailyOffer ? "tilbud" : "sitat"}:
                </label>
                <div className="flex space-x-2">
                  <Input
                    id="newContent"
                    placeholder={
                      isDailyOffer
                        ? "F.eks. Kaffe og kake: 50kr"
                        : "F.eks. Kaffe varmer sjelen..."
                    }
                    value={newDailyContent}
                    onChange={(e) => setNewDailyContent(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={handleSaveDailyContent}>Lagre</Button>
                </div>

                {/* Add image upload section */}
                <div className="mt-4 space-y-2">
                  <label className="text-sm font-medium">
                    Legg til bilde (valgfritt):
                  </label>
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() =>
                          document
                            .getElementById("daily-content-image-upload")
                            .click()
                        }
                        disabled={uploadingDailyImage}
                        className="relative"
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        {uploadingDailyImage ? "Laster opp..." : "Velg fil"}
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleDailyContentImageUpload}
                          disabled={uploadingDailyImage}
                          id="daily-content-image-upload"
                          className="hidden absolute inset-0 opacity-0 cursor-pointer"
                        />
                      </Button>

                      {dailyContentImage && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setDailyContentImage("");
                            setDailyContentPreviewImage("");
                          }}
                        >
                          Fjern bilde
                        </Button>
                      )}
                    </div>
                    {uploadingDailyImage && (
                      <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-1 bg-primary animate-pulse"></div>
                      </div>
                    )}

                    {/* Image preview */}
                    {dailyContentPreviewImage && (
                      <div className="border rounded-md p-2 bg-gray-50">
                        <p className="text-sm font-medium mb-2">
                          Bildeforhåndsvisning:
                        </p>
                        <div className="relative w-full h-36 rounded-md overflow-hidden border bg-white">
                          <img
                            src={dailyContentPreviewImage}
                            alt="Forhåndsvisning"
                            className="object-contain w-full h-full"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src =
                                "https://via.placeholder.com/150?text=Bilde+Feil";
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <p className="text-xs text-gray-500">
                  Maks 10 {isDailyOffer ? "tilbud" : "sitater"} lagres i
                  historikken. Eldre innhold erstattes automatisk.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Product Edit/Add Dialog */}
      <Dialog open={productDialogOpen} onOpenChange={setProductDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? "Rediger produkt" : "Legg til produkt"}
            </DialogTitle>
            <DialogDescription>
              {editingProduct
                ? "Gjør endringer til dette produktet."
                : "Legg til et nytt produkt i kafémenyen din."}
            </DialogDescription>
          </DialogHeader>
          <Form {...productForm}>
            <form
              onSubmit={productForm.handleSubmit(onProductSubmit)}
              className="space-y-4"
            >
              <FormField
                control={productForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Navn</FormLabel>
                    <FormControl>
                      <Input placeholder="Espresso" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={productForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Beskrivelse</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="En deilig espressokaffe..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={productForm.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pris</FormLabel>
                    <FormControl>
                      <Input placeholder="49 kr" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={productForm.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last opp bilde</FormLabel>
                    <div className="space-y-4">
                      {/* Upload section with improved UI */}
                      <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                          <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={() =>
                              document.getElementById("image-upload").click()
                            }
                            disabled={uploadingImage}
                            className="relative"
                          >
                            <Upload className="mr-2 h-4 w-4" />
                            {uploadingImage ? "Laster opp..." : "Velg fil"}
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload}
                              disabled={uploadingImage}
                              id="image-upload"
                              className="hidden absolute inset-0 opacity-0 cursor-pointer"
                            />
                          </Button>
                        </div>
                        {uploadingImage && (
                          <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-1 bg-primary animate-pulse"></div>
                          </div>
                        )}
                      </div>

                      {/* Removed */}
                      <div className="pt-2 border-t">
                        <p className="text-sm font-medium mb-1">
                          Eller skriv inn en bilde-URL:
                        </p>
                        <FormControl>
                          <Input
                            placeholder="https://example.com/image.jpg"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              setPreviewImage(e.target.value);
                            }}
                          />
                        </FormControl>
                      </div>
                      {}

                      {/* Image preview with improved styling */}
                      {(field.value || previewImage) && (
                        <div className="border rounded-md p-2 bg-gray-50">
                          <p className="text-sm font-medium mb-2">
                            Bildeforhåndsvisning:
                          </p>
                          <div className="relative w-full h-48 rounded-md overflow-hidden border bg-white">
                            <img
                              src={previewImage || field.value}
                              alt="Forhåndsvisning"
                              className="object-contain w-full h-full"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src =
                                  "https://via.placeholder.com/150?text=Bilde+Feil";
                              }}
                            />
                          </div>
                        </div>
                      )}

                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={productForm.control}
                name="promotion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kampanje (valgfritt)</FormLabel>
                    <FormControl>
                      <Input placeholder="2 for 50kr" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">
                  {editingProduct ? "Lagre endringer" : "Legg til produkt"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      <Dialog open={hoursDialogOpen} onOpenChange={setHoursDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Rediger åpningstider</DialogTitle>
            <DialogDescription>
              {editingDay && `Oppdater åpningstider for ${editingDay.day}.`}
            </DialogDescription>
          </DialogHeader>
          <Form {...hoursForm}>
            <form
              onSubmit={hoursForm.handleSubmit(onHoursSubmit)}
              className="space-y-4"
            >
              <FormField
                control={hoursForm.control}
                name="hours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Timer</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="09:30 - 12:00 eller Stengt"
                        {...field}
                      />
                    </FormControl>
                    <div className="flex gap-2 mt-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => field.onChange("09:30 - 12:00")}
                      >
                        Morgen
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => field.onChange("12:00 - 16:00")}
                      >
                        Ettermiddag
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => field.onChange("Stengt")}
                      >
                        Stengt
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">Lagre endringer</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
