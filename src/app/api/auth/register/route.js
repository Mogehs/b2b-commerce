import connectMongo from "@/lib/mongoose";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(request) {
  // parse JSON body from the request
  const { name, email, password } = await request.json();

  await connectMongo();

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return new Response(JSON.stringify({ error: "User already exists" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await User.create({
    name,
    email,
    password: hashedPassword,
    provider: "credentials",
  });

  return new Response(JSON.stringify({ success: true }), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
}
