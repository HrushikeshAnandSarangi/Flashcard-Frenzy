import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabaseServer";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("profiles")
      .select("history")
      .eq("id", userId)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ history: data?.history || [] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId, roomId } = await req.json();

    if (!userId || !roomId) {
      return NextResponse.json({ error: "Missing userId or roomId" }, { status: 400 });
    }

    const supabase = await createClient();

    const { data: userData, error: fetchError } = await supabase
      .from("profiles")
      .select("history")
      .eq("id", userId)
      .single();

    if (fetchError || !userData) {
      return NextResponse.json({ error: fetchError?.message || "User not found" }, { status: 404 });
    }

    const currentHistory: string[] = userData.history || [];
    const newHistory = currentHistory.includes(roomId) ? currentHistory : [...currentHistory, roomId];

    const { error: updateError, data: updated } = await supabase
      .from("users")
      .update({ history: newHistory })
      .eq("id", userId)
      .select();

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, history: newHistory, updated: updated?.[0] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
