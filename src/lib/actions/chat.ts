"use server";

import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import nodemailer from "nodemailer";

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
    await prisma.message.updateMany({
      where: {
        conversationId,
        senderId: { not: session.user.id },
        isRead: false,
      },
      data: { isRead: true },
    });
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

    // Update conversation updatedAt timestamp
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    });

    revalidatePath(`/messages/${conversationId}`);

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

        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });

        await transporter.sendMail({
          from: `"Kisii Market Notifications" <${process.env.SMTP_USER}>`,
          to: recipient.email,
          subject: `New Message: ${senderName} on Kisii Market`,
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <style>
                @media only screen and (max-width: 600px) {
                  .container { width: 100% !important; border-radius: 0 !important; border: none !important; }
                  .content { padding: 20px !important; }
                  .button { width: 100% !important; box-sizing: border-box !important; }
                }
              </style>
            </head>
            <body style="margin: 0; padding: 20px 0; background-color: #f8fafc;">
              <div class="container" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; width: 95%; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 24px; overflow: hidden; background-color: #ffffff; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                <div style="background-color: #059669; padding: 40px 20px; color: white; text-align: center;">
                  <div style="background-color: rgba(255,255,255,0.2); width: 64px; height: 64px; border-radius: 20px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px; font-weight: 900; font-size: 32px; font-style: italic;">K</div>
                  <h1 style="margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.02em;">New Message Received</h1>
                </div>
                <div class="content" style="padding: 40px; color: #1e293b;">
                  <p style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600;">
                    Hi ${recipient.name || "Student"},
                  </p>
                  <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #475569;">
                    <strong>${senderName}</strong> has sent you a message about <strong>${conversation.product.title}</strong>.
                  </p>
                  
                  <div style="margin-bottom: 32px; padding: 24px; background-color: #f1f5f9; border-radius: 20px; color: #334155; font-size: 16px; line-height: 1.6; border-left: 4px solid #059669;">
                    "${text}"
                  </div>

                  <div style="text-align: center;">
                    <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://kisii-market.vercel.app'}/messages/${conversationId}" 
                       class="button"
                       style="display: inline-block; background-color: #059669; color: white; padding: 18px 36px; border-radius: 16px; font-weight: 800; text-decoration: none; text-transform: uppercase; letter-spacing: 0.05em; font-size: 14px; box-shadow: 0 10px 15px -3px rgba(5, 150, 105, 0.3);">
                      Open Chat & Reply
                    </a>
                  </div>

                  <div style="margin-top: 40px; padding-top: 24px; border-top: 1px solid #f1f5f9; text-align: center;">
                    <p style="margin: 0; font-size: 13px; color: #94a3b8; line-height: 1.5;">
                      Stay safe: Always meet on campus in public areas.<br />
                      &copy; ${new Date().getFullYear()} Kisii Secondhand Market
                    </p>
                  </div>
                </div>
              </div>
            </body>
            </html>
          `,
        });
      }
    } catch (emailErr) {
      console.error("Failed to send notification email:", emailErr);
      // Don't fail the message sending if email fails
    }

    return { success: true, message: { ...message, sender: { name: session.user.name } } };
  } catch (err) {
    console.error("Failed to send message:", err);
    return { error: "Failed to send message" };
  }
}

export async function getConversations() {
  const session = await getSession();
  if (!session) return [];

  const userId = session.user.id;

  return await prisma.conversation.findMany({
    where: {
      OR: [{ buyerId: userId }, { sellerId: userId }],
    },
    include: {
      product: true,
      buyer: { select: { name: true, email: true } },
      seller: { select: { name: true, email: true } },
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
    orderBy: { updatedAt: "desc" },
  });
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
      orderBy: { createdAt: "asc" },
    });

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
      messages,
      otherUserLastActive,
    };
  } catch (err) {
    console.error("Error in getMessages:", err);
    return { messages: [], otherUserLastActive: null };
  }
}

