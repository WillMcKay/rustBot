import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.steamId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiUrl = process.env.RUSTBOT_API_URL;
  const apiSecret = process.env.RUSTBOT_API_SECRET;

  if (!apiUrl || !apiSecret) {
    return NextResponse.json(
      { error: "Server not configured" },
      { status: 500 }
    );
  }

  const response = await fetch(`${apiUrl}/bots/${session.user.steamId}`, {
    headers: {
      "x-api-secret": apiSecret,
    },
  });

  if (response.status === 404) {
    return NextResponse.json({ exists: false });
  }

  let data: unknown = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  return NextResponse.json(data ?? { ok: response.ok }, {
    status: response.status,
  });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.steamId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiUrl = process.env.RUSTBOT_API_URL;
  const apiSecret = process.env.RUSTBOT_API_SECRET;

  if (!apiUrl || !apiSecret) {
    return NextResponse.json(
      { error: "Server not configured" },
      { status: 500 }
    );
  }

  const body = await req.json();
  const { server, port, playerId, playerToken } = body || {};

  if (!server || !port || !playerId || !playerToken) {
    return NextResponse.json(
      {
        error: "Missing required fields",
        required: ["server", "port", "playerId", "playerToken"],
      },
      { status: 400 }
    );
  }

  const response = await fetch(`${apiUrl}/bots`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-secret": apiSecret,
    },
    body: JSON.stringify({
      steamId: session.user.steamId,
      server,
      port,
      playerId,
      playerToken,
    }),
  });

  let data: unknown = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  return NextResponse.json(data ?? { ok: response.ok }, {
    status: response.status,
  });
}
