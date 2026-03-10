import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // 1. Création d'un mot de passe sécurisé (ex: "password123")
  const hashedPassword = await bcrypt.hash("Léo1234", 10);

  // 2. Création ou mise à jour de l'utilisateur de test
  const testUser = await prisma.user.upsert({
    where: { email: "leo.rasolomanana94@gmail.com" },
    update: {},
    create: {
      name: "Léo Rasolomanana",
      email: "leo.rasolomanana94@gmail.com",
      password: hashedPassword, // On stocke le hash, pas "password123" en clair
      city: "ORLY",
      country: "France",
    },
  });

  // 3. Création de tes activités (createMany ne supporte pas upsert, 
  // donc on vide avant ou on utilise skipDuplicates)
  await prisma.activity.createMany({
    skipDuplicates: true,
    data: [
      {
        name: "Randonnée alpine",
        location: "Chamonix",
        typeActivity: "Randonnée",
        image: "/images/rando.jpg",
        altitude: 2200,
        date: new Date("2025-06-10"),
        difficulty: "moyen",
        description: "Randonnée guidée en montagne.",
        price: 35,
        duration: 180
      },
      {
        name: "Escalade débutant",
        location: "Annecy",
        typeActivity: "Escalade",
        image: "/images/escalade.jpg",
        altitude: 800,
        date: new Date("2025-06-15"),
        difficulty: "facile",
        description: "Initiation à l'escalade en extérieur.",
        price: 50,
        duration: 120
      }
    ]
  });

  console.log("✅ Seed terminé avec succès !");
  console.log("Utilisateur : leo.rasolomanana94@gmail.com | Mot de passe : Léo1234");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });