import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import "dotenv/config";

const connectionString = process.env.DATABASE_URL;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  try {
    console.log("Simulating createProduct...");
    
    // 1. Get or create a test user
    const user = await prisma.user.upsert({
      where: { email: "test_seller@example.com" },
      update: {},
      create: {
        email: "test_seller@example.com",
        password: "password",
        name: "Test Seller",
      }
    });
    console.log("Using User ID:", user.id);

    // 2. Get or create a category
    const categoryName = "Electronics";
    let category = await prisma.category.findUnique({
      where: { name: categoryName },
    });
    if (!category) {
      category = await prisma.category.create({
        data: { name: categoryName, slug: "electronics" }
      });
    }
    console.log("Using Category ID:", category.id);

    // 3. Create product
    const product = await prisma.product.create({
      data: {
        title: "Test Product",
        description: "Test Description",
        price: 100,
        condition: "Good",
        image: "https://example.com/image.jpg",
        categoryId: category.id,
        sellerId: user.id,
        status: "PENDING",
      }
    });
    console.log("Product Created Successfully:", product.id);

    console.log("Success!");
  } catch (err: any) {
    console.error("Simulation failed!");
    console.error(err.message);
    if (err.code) console.error("Error code:", err.code);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main();
