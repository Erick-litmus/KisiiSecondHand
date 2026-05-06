"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";

export async function createProduct(formData: {
  title: string;
  price: number;
  description: string;
  condition: string;
  categoryName: string;
  image: string;
  image2?: string;
}) {
  console.log("createProduct action triggered with:", formData);
  
  try {
    const session = await getSession();
    if (!session) {
      console.log("No session found in createProduct");
      return { success: false, error: "You must be logged in to sell items" };
    }

    if (isNaN(formData.price)) {
      return { success: false, error: "Invalid price value" };
    }

    // 1. Find or create the category
    let category = await prisma.category.findUnique({
      where: { name: formData.categoryName },
    });

    if (!category) {
      console.log("Creating new category:", formData.categoryName);
      category = await prisma.category.create({
        data: {
          name: formData.categoryName,
          slug: formData.categoryName.toLowerCase().replace(/\s+/g, "-"),
        },
      });
    }

    // 2. Create the product using session user
    const product = await prisma.product.create({
      data: {
        title: formData.title,
        description: formData.description,
        price: formData.price,
        condition: formData.condition,
        image: formData.image || null,
        image2: formData.image2 || null,
        categoryId: category.id,
        sellerId: session.user.id,
        status: "PENDING",
      },
    });

    console.log("Product created successfully:", product.id);

    revalidatePath("/");
    revalidatePath("/browse");
    revalidatePath("/admin");

    // Return only serializable data
    return { success: true, productId: product.id };
  } catch (error: any) {
    console.error("CRITICAL: Failed to create product:", error);
    // Return a clean error message to the client
    return { success: false, error: error.message || "An unexpected database error occurred" };
  }
}

export async function markProductAsSold(productId: string) {
  try {
    const session = await getSession();
    if (!session) return { error: "Not authenticated" };

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) return { error: "Product not found" };

    // Check ownership or admin status
    if (product.sellerId !== session.user.id && session.user.role !== "ADMIN") {
      return { error: "Not authorized to update this listing" };
    }

    await prisma.product.update({
      where: { id: productId },
      data: { status: "SOLD" },
    });

    revalidatePath("/dashboard");
    revalidatePath("/browse");
    revalidatePath("/");
    
    return { success: true };
  } catch (error) {
    console.error("Failed to mark product as sold:", error);
    return { error: "Failed to mark product as sold" };
  }
}

