import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabaseServer";

export async function POST(req: Request) {
  const { email, password, username } = await req.json();
  const supabase = await createClient();

  // Step 1: Sign up the user in Supabase Auth
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username }, // still store it in user_metadata for convenience
    },
  });

  if (error || !data.user) {
    return NextResponse.json(
      { error: error?.message || "Signup failed" },
      { status: 400 }
    );
  }

  const userId = data.user.id;

  // Step 2: Insert into "users" table
  const { error: insertError } = await supabase.from("profiles").insert({
    id: userId, // match auth user id
    email,
    username,
    history: [], // start with empty array
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
