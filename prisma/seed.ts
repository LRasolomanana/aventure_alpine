import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Cleanup: Suppression des anciennes données...");
  // Nettoie la base pour enlever les vieux liens /images/rando.jpg qui causent des 404
  await prisma.activity.deleteMany();

  // 1. Création du mot de passe pour l'utilisateur de test
  const hashedPassword = await bcrypt.hash("Léo1234", 10);

  console.log("Seed: Création de l'utilisateur...");
  const testUser = await prisma.user.upsert({
    where: { email: "leo.rasolomanana94@gmail.com" },
    update: {},
    create: {
      name: "Léo Rasolomanana",
      email: "leo.rasolomanana94@gmail.com",
      password: hashedPassword,
      city: "ORLY",
      country: "France",
    },
  });

  console.log("Seed: Création des activités...");
  const activities = [
    // --- RANDONNÉE ---
    {
      name: "Tour du Mont-Blanc",
      location: "Chamonix",
      typeActivity: "Randonnée",
      image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800",
      altitude: 4810,
      date: new Date("2025-07-10"),
      difficulty: "difficile",
      description: "Une aventure épique autour du toit de l'Europe. Panoramas à couper le souffle.",
      price: 120,
      duration: 480
    },
    {
      name: "Sentier des Crêtes",
      location: "Vercors",
      typeActivity: "Randonnée",
      image: "https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&q=80&w=800",
      altitude: 1900,
      date: new Date("2025-05-20"),
      difficulty: "moyen",
      description: "Randonnée accessible avec vue panoramique sur les Alpes du Sud.",
      price: 25,
      duration: 240
    },
    // --- ESCALADE ---
    {
      name: "Grande Voie Alpine",
      location: "Haute-Savoie",
      typeActivity: "Escalade",
      image: "https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&q=80&w=800",
      altitude: 1200,
      date: new Date("2025-06-15"),
      difficulty: "moyen",
      description: "Perfectionnement en grande voie avec un guide haute montagne.",
      price: 65,
      duration: 360
    },
    {
      name: "Bloc en forêt",
      location: "Fontainebleau",
      typeActivity: "Escalade",
      image: "https://images.unsplash.com/photo-1516592673814-189c5d47ed71?auto=format&fit=crop&q=80&w=800",
      altitude: 150,
      date: new Date("2025-04-12"),
      difficulty: "facile",
      description: "Session de bloc ludique. Idéal pour débuter sans baudrier.",
      price: 15,
      duration: 180
    },
    // --- SKI ---
    {
      name: "Ski de Poudreuse",
      location: "Val d'Isère",
      typeActivity: "Ski",
      image: "https://images.unsplash.com/photo-1476522306485-641e828461b7?auto=format&fit=crop&q=80&w=800",
      altitude: 2800,
      date: new Date("2025-02-10"),
      difficulty: "difficile",
      description: "Hors-piste sécurisé dans les meilleurs couloirs de la station.",
      price: 150,
      duration: 300
    },
    {
      name: "Ski de Fond",
      location: "Les Saisies",
      typeActivity: "Ski",
      image: "https://images.unsplash.com/photo-1551698618-1fed5d965596?auto=format&fit=crop&q=80&w=800",
      altitude: 1650,
      date: new Date("2025-01-05"),
      difficulty: "facile",
      description: "Parcours nordique dans un cadre sapiné exceptionnel.",
      price: 20,
      duration: 120
    }
  ];

  await prisma.activity.createMany({
    data: activities,
  });

  console.log("✅ Seed terminé avec succès !");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });