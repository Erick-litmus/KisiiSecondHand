"use server";

import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { MailService } from "@/lib/mail-service";
import { supabase } from "@/lib/supabase";

export async function updateLastActive() {
  const session = await getSession();
  if (!session) return;

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { lastActive: new Date() },
    });
  } catch (err) {
    console.error("Failed to update last active:", err);
  }
}

export async function markMessagesAsRead(conversationId: string) {
  const session = await getSession();
  if (!session) return;

  try {
    const result = await prisma.message.updateMany({
      where: {
        conversationId,
        senderId: { not: session.user.id },
        isRead: false,
      },
      data: { isRead: true },
    });

    if (result.count > 0) {
      // Broadcast removed from server, handled by client instead
    }
  } catch (err) {
    console.error("Failed to mark messages as read:", err);
  }
}

export async function createConversation(productId: string, sellerId: string) {
  const session = await getSession();
  if (!session) return { error: "You must be logged in to chat" };

  const buyerId = session.user.id;

  if (buyerId === sellerId) {
    return { error: "You cannot start a conversation with yourself" };
  }

  try {
    let conversation = await prisma.conversation.findUnique({
      where: {
        productId_buyerId: {
          productId,
          buyerId,
        },
      },
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          productId,
          buyerId,
          sellerId,
        },
      });
    }

    return { success: true, conversationId: conversation.id };
  } catch (err) {
    console.error("Failed to create conversation:", err);
    return { error: "Failed to start chat" };
  }
}

export async function sendMessage(conversationId: string, text: string) {
  const session = await getSession();
  if (!session) return { error: "You must be logged in to send messages" };

  try {
    const message = await prisma.message.create({
      data: {
        conversationId,
        senderId: session.user.id,
        text,
      },
    });

    // Update conversation updatedAt timestamp AND sender lastActive
    await Promise.all([
      prisma.conversation.update({
        where: { id: conversationId },
        data: { updatedAt: new Date() },
      }),
      prisma.user.update({
        where: { id: session.user.id },
        data: { lastActive: new Date() },
      })
    ]);

    revalidatePath("/messages");
    revalidatePath(`/messages/${conversationId}`);

    const resultMessage = { ...message, sender: { name: session.user.name } };

    // Broadcast removed from server, handled by client instead

    // Send email notification to recipient
    try {
      const conversation = await prisma.conversation.findUnique({
        where: { id: conversationId },
        include: {
          buyer: true,
          seller: true,
          product: true,
        },
      });

      if (conversation) {
        const recipient = session.user.id === conversation.buyerId ? conversation.seller : conversation.buyer;
        const senderName = session.user.name || "A user";

        // Create in-app notification for the recipient
        await prisma.notification.create({
          data: {
            userId: recipient.id,
            title: `New Message from ${senderName}`,
            message: text.length > 80 ? text.substring(0, 80) + "..." : text,
            type: "message",
            link: `/messages/${conversationId}`,
          },
        });

        // The transporter is now imported from @/lib/mail


        await MailService.sendNewMessageNotification(
          recipient.email,
          senderName,
          text.length > 80 ? text.substring(0, 80) + "..." : text,
          conversationId
        );
      }
    } catch (emailErr) {
      console.error("Failed to send notification email:", emailErr);
      // Don't fail the message sending if email fails
    }

    return { success: true, message: resultMessage };
  } catch (err) {
    console.error("Failed to send message:", err);
    return { error: "Failed to send message" };
  }
}

export async function getConversations() {
  const session = await getSession();
  if (!session) return [];

  const userId = session.user.id;

  try {
    return await prisma.conversation.findMany({
      where: {
        OR: [{ buyerId: userId }, { sellerId: userId }],
      },
      include: {
        product: true,
        buyer: { select: { id: true, name: true, email: true, avatar: true } },
        seller: { select: { id: true, name: true, email: true, avatar: true } },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
      orderBy: { updatedAt: "desc" },
      take: 50, // Limit to recent 50 conversations for performance
    });
  } catch (err) {
    console.error("Error fetching conversations:", err);
    return [];
  }
}

export async function getMessages(conversationId: string) {
  const session = await getSession();
  if (!session) return { messages: [], otherUserLastActive: null };

  const userId = session.user.id;

  try {
    // Check if user belongs to conversation or is admin
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      select: { buyerId: true, sellerId: true },
    });

    const isAdmin = session.user.role === "ADMIN";
    const isParticipant = conversation && (conversation.buyerId === userId || conversation.sellerId === userId);

    if (!isAdmin && !isParticipant) {
      return { messages: [], otherUserLastActive: null };
    }

    const messages = await prisma.message.findMany({
      where: { conversationId },
      include: {
        sender: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 100, // Fetch the 100 most recent messages
    });

    // Reverse to show in chronological order
    const chronMessages = messages.reverse();

    // Get other user's last active if conversation exists
    let otherUserLastActive = null;
    if (conversation) {
      const otherUserId = conversation.buyerId === userId ? conversation.sellerId : conversation.buyerId;
      
      if (otherUserId) {
        try {
          const otherUser = await prisma.user.findUnique({
            where: { id: otherUserId },
            select: { lastActive: true },
          });
          otherUserLastActive = otherUser?.lastActive || null;
        } catch (findErr) {
          console.error("Failed to fetch other user status:", findErr);
        }
      }
    }

    return {
      messages: chronMessages,
      otherUserLastActive,
    };
  } catch (err) {
    console.error("Error in getMessages:", err);
    return { messages: [], otherUserLastActive: null };
  }
}

