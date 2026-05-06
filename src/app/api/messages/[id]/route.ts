import { NextRequest, NextResponse } from "next/server";
import { getMessages } from "@/lib/actions/chat";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const messages = await getMessages(id);
    return NextResponse.json(messages);
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}
