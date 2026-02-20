import { Trade } from "@/app/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not set");
}

type TradeUpdate = Partial<Omit<Trade, "id">>;


export async function getTrades() {
  const res = await fetch(`${BASE_URL}/trades`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch trades");
  }

  return res.json();
}

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

export async function updateTrade(id: number, trade: TradeUpdate) {
  const res = await fetch(`${BASE_URL}/trades/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(trade),
  });

  if (!res.ok) {
    throw new Error("Failed to update trade");
  }

  return res.json();
}

export async function deleteTrade(id: number) {
  const res = await fetch(`${BASE_URL}/trades/${id}`, {
    method: "DELETE"
  });

  if (!res.ok) {
    throw new Error("Failed to delete trade");
  }

  return res.json();
}