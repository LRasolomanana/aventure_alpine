"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Header from "@/components/navbar";
import ReCAPTCHA from "react-google-recaptcha";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailError, setEmailError] = useState("");

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z][^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEmailError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const name = formData.get("name") as string;

    // Validation de l'email
    if (!email || !validateEmail(email)) {
      setEmailError("Veuillez entrer une adresse email valide");
      return;
    }

    if (!name.trim()) {
      setEmailError("Veuillez entrer votre nom");
      return;
    }

    setIsSubmitting(true);

    // This is just for visual demonstration
    setTimeout(() => {
      setIsSubmitting(false);
      alert("Message envoyé avec succès!");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />

      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-white mb-4">
              Contactez-nous
            </h1>
            <p className="text-gray-400">
              Vous avez des questions ou besoin d'informations supplémentaires ?
              N'hésitez pas à nous contacter.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm p-8 rounded-lg shadow-lg border border-white/10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white">
                    Nom
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Votre nom"
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="votre@email.com"
                    className="bg-white/10 border-white/20 text-white"
                  />
                  {emailError && (
                    <p className="text-red-400 text-sm mt-1">{emailError}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject" className="text-white">
                  Sujet
                </Label>
                <Input
                  id="subject"
                  name="subject"
                  placeholder="Sujet de votre message"
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-white">
                  Message
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Votre message..."
                  rows={6}
                  className="bg-white/10 border-white/20 text-white resize-none"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-sky-600 hover:bg-sky-500"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Envoi en cours..." : "Envoyer le message"}
              </Button>
            </form>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="p-6 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
              <div className="text-sky-400 text-2xl mb-3">📍</div>
              <h3 className="text-white font-medium mb-2">Adresse</h3>
              <p className="text-gray-400">
                123 Rue des Alpes, 74000 Annecy, France
              </p>
            </div>

            <div className="p-6 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
              <div className="text-sky-400 text-2xl mb-3">📞</div>
              <h3 className="text-white font-medium mb-2">Téléphone</h3>
              <p className="text-gray-400">+33 6 00 00 00 00</p>
            </div>

            <div className="p-6 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
              <div className="text-sky-400 text-2xl mb-3">✉️</div>
              <h3 className="text-white font-medium mb-2">Email</h3>
              <p className="text-gray-400">contact@aventures-alpines.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
