import { updateDefaultAccount } from "@/actions/account";

export async function POST(request) {
  try {
    const { accountId } = await request.json();
    const result = await updateDefaultAccount(accountId);
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}