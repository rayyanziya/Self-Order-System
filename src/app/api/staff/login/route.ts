import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { pin } = await req.json();

  if (!pin || pin !== process.env.STAFF_PIN) {
    return NextResponse.json({ error: "Incorrect PIN" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set("staff_auth", "1", {
    httpOnly: true,
    maxAge: 60 * 60 * 8, // 8 hours
    path: "/",
    sameSite: "lax",
  });
  return res;
}
