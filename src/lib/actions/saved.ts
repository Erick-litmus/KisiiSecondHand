"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";

export async function toggleSavedItem(productId: string) {
  try {
    const session = await getSession();
    if (!session || !session.user) {
      return { success: false, error: "Must be logged in to save items." };
    }

    const existing = await prisma.savedItem.findUnique({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId,
        },
      },
    });

    if (existing) {
      await prisma.savedItem.delete({
        where: { id: existing.id },
      });
    } else {
      await prisma.savedItem.create({
        data: {
          userId: session.user.id,
          productId,
        },
      });
    }

    revalidatePath("/");
    revalidatePath("/browse");
    revalidatePath("/saved");
    revalidatePath(`/product/${productId}`);
    return { success: true, saved: !existing };
  } catch (error) {
    console.error("Error toggling saved item:", error);
    return { success: false, error: "Failed to toggle saved item." };
  }
}
