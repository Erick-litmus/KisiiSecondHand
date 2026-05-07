import { NextRequest, NextResponse } from "next/server";
import { getMessages, markMessagesAsRead, updateLastActive } from "@/lib/actions/chat";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    // Update current user's status
    await updateLastActive();
    // Mark messages as read
    await markMessagesAsRead(id);
    
    const data = await getMessages(id);
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}
