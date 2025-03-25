import { createAccount } from "@/actions/dashboard";

export async function POST(request) {
  try {
    const data = await request.json();
    console.log("Received data for account creation:", data); // Log incoming data
    const result = await createAccount(data);
    console.log("Account created successfully:", result); // Log success
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in /api/create-account:", error); // Log detailed error
    return new Response(
      JSON.stringify({ error: error.message || "Failed to create account", stack: error.stack }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}