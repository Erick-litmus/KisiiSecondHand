"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function approveProduct(productId: string) {
  try {
    await prisma.product.update({
      where: { id: productId },
      data: { status: "APPROVED" },
    });
    revalidatePath("/admin");
    revalidatePath("/admin/products");
    revalidatePath("/");
    revalidatePath("/browse");
    return { success: true };
  } catch (error) {
    console.error("Failed to approve product:", error);
    return { success: false, error: "Failed to approve product" };
  }
}

export async function rejectProduct(productId: string) {
  try {
    await prisma.product.update({
      where: { id: productId },
      data: { status: "REJECTED" },
    });
    revalidatePath("/admin");
    revalidatePath("/admin/products");
    revalidatePath("/");
    revalidatePath("/browse");
    return { success: true };
  } catch (error) {
    console.error("Failed to reject product:", error);
    return { success: false, error: "Failed to reject product" };
  }
}

export async function deleteProduct(productId: string) {
  try {
    // 1. Find all conversations related to this product
    const conversations = await prisma.conversation.findMany({
      where: { productId },
      select: { id: true },
    });
    const conversationIds = conversations.map((c) => c.id);

    // 2. Delete related messages and reports tied to those conversations
    if (conversationIds.length > 0) {
      await prisma.message.deleteMany({
        where: { conversationId: { in: conversationIds } },
      });
      await prisma.report.deleteMany({
        where: { conversationId: { in: conversationIds } },
      });
      await prisma.conversation.deleteMany({
        where: { id: { in: conversationIds } },
      });
    }

    // 3. Delete other records directly linked to the product
    await prisma.savedItem.deleteMany({
      where: { productId },
    });
    await prisma.report.deleteMany({
      where: { productId },
    });

    // 4. Finally delete the product itself
    await prisma.product.delete({
      where: { id: productId },
    });

    revalidatePath("/admin");
    revalidatePath("/admin/products");
    revalidatePath("/");
    revalidatePath("/browse");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete product:", error);
    return { success: false, error: "Failed to delete product" };
  }
}

export async function dismissReport(reportId: string) {
  try {
    await prisma.report.update({
      where: { id: reportId },
      data: { status: "DISMISSED" },
    });
    revalidatePath("/admin/reports");
    return { success: true };
  } catch (error) {
    console.error("Failed to dismiss report:", error);
    return { success: false, error: "Failed to dismiss report" };
  }
}

export async function banUser(userId: string) {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { isBanned: true },
    });
    
    // Also resolve related reports
    await prisma.report.updateMany({
      where: { reportedUserId: userId, status: "PENDING" },
      data: { status: "REVIEWED" },
    });
    
    revalidatePath("/admin/reports");
    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    console.error("Failed to ban user:", error);
    return { success: false, error: "Failed to ban user" };
  }
}
