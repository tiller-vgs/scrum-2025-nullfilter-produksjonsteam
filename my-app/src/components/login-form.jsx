"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export function LoginForm({ className, ...props }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");

  // Initialize admin credentials on first load if not already set
  useEffect(() => {
    if (!localStorage.getItem("admin_credentials")) {
      localStorage.setItem(
        "admin_credentials",
        JSON.stringify({ username: "admin", password: "admin" })
      );
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    try {
      const credentials = JSON.parse(localStorage.getItem("admin_credentials"));

      if (
        formData.username === credentials.username &&
        formData.password === credentials.password
      ) {
        // Set login state
        localStorage.setItem("isLoggedIn", "true");
        // Redirect to dashboard
        router.push("/dashboard");
      } else {
        setError("Feil brukernavn eller passord");
      }
    } catch (err) {
      setError("Noe gikk galt. Prøv igjen.");
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Logg inn</CardTitle>
          <CardDescription>Logg inn for å administrere kafeen</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="username">Brukernavn</Label>
                <Input
                  id="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Passord</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="submit" className="w-full">
                Logg inn
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
