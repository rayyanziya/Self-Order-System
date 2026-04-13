import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.menuItem.deleteMany();

  await prisma.menuItem.createMany({
    data: [
      {
        code: "A001",
        name: "Ceker Mercon",
        price: 225,
        category: "FOOD",
        description: "Chicken feet cooked in spicy Mercon chili sauce",
        imagePath: "/images/ceker_mercon.jpg",
        available: true,
      },
      {
        code: "A002",
        name: "Seblak",
        price: 200,
        category: "FOOD",
        description: "Savoury crackers in spicy kencur broth",
        imagePath: "/images/seblak.jpg",
        available: true,
      },
      {
        code: "B001",
        name: "Es Teh Manis",
        price: 75,
        category: "DRINK",
        description: "Indonesian sweet iced tea",
        imagePath: "/images/es_tehmanis.jpg",
        available: true,
      },
    ],
  });

  console.log("Seeded 3 menu items successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
