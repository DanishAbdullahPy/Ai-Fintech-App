import { createAccount } from "@/actions/dashboard";

export async function POST(request) {
  try {
    const data = await request.json();
    const result = await createAccount(data);
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message || "Failed to create account" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}