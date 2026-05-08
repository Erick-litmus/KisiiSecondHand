import React from "react";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { getMessages } from "@/lib/actions/chat";
import ChatInterface from "@/components/ChatInterface";
import { notFound, redirect } from "next/navigation";

export default async function ConversationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const conversation = await prisma.conversation.findUnique({
    where: { id },
    include: {
      product: true,
      buyer: { select: { id: true, name: true, email: true } },
      seller: { select: { id: true, name: true, email: true } },
    },
  });

  if (!conversation) {
    notFound();
  }

  // Check if user has access or is admin
  const isBuyer = conversation.buyerId === session.user.id;
  const isSeller = conversation.sellerId === session.user.id;
  const isAdmin = session.user.role === "ADMIN";

  if (!isBuyer && !isSeller && !isAdmin) {
    redirect("/messages");
  }

  const data = await getMessages(id);
  const otherUser = isBuyer ? conversation.seller : conversation.buyer;

  return (
    <div className="h-dvh bg-[#0a0a0a]">
      <ChatInterface 
        conversationId={id}
        initialMessages={data.messages || []}
        currentUser={session.user}
        otherUser={otherUser}
        product={conversation.product}
        initialLastActive={data.otherUserLastActive ? data.otherUserLastActive.toISOString() : null}
      />
    </div>
  );
}
