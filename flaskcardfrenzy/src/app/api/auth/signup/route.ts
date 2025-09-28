import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabaseServer";

export async function POST(req: Request) {
  const { email, password, username } = await req.json();
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username }, 
    },
  });

  if (error || !data.user) {
    return NextResponse.json(
      { error: error?.message || "Signup failed" },
      { status: 400 }
    );
  }

  const userId = data.user.id;

  const { error: insertError } = await supabase.from("profiles").insert({
    id: userId, 
    email,
    username,
    history: [], 
  });

  if (insertError) {
    console.error("Error inserting into users table:", insertError.message);
    return NextResponse.json(
      { error: insertError.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ user: data.user });
}
