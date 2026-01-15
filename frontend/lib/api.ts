const BASE_URL = "http://localhost:3001/api/v1";

export async function getTrades() {
  const res = await fetch(`${BASE_URL}/trades`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch trades");
  }

  return res.json();
}
//TODO: Add type for trade
export async function createTrade(trade: any) {
  const res = await fetch(`${BASE_URL}/trades`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ trade }),
  });

  if (!res.ok) {
    throw new Error("Failed to create trade");
  }

  return res.json();
}
