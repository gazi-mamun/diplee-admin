import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";
import toast from "react-hot-toast";

const secret = process.env.JWT_SECRET;
const baseUrl = "https://admin.diplee.com";
// const baseUrl = "http://localhost:3000";

export default async function middleware(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value;

  const url = req.nextUrl.clone();
  const pathname = url?.pathname;

  if (pathname == "/" || pathname == "/signup") {
    if (token) {
      const payload = await verify(token, secret);
      if (payload) {
        return NextResponse.redirect(`${baseUrl}/products`);
      }
    }

    return NextResponse.next();
  }
  if (
    pathname === "/products" ||
    pathname === "/users" ||
    pathname === "/categories" ||
    pathname === "/orders"
  ) {
    if (token) {
      if (pathname === "/users") {
        return await checkJwt(token, secret, ["ADMIN"]);
      }

      return await checkJwt(token, secret, ["ADMIN", "MODERATOR"]);
    } else {
      return NextResponse.redirect(`${baseUrl}`);
    }
  }

  return NextResponse.next();
}

export async function verify(token: string, secret: string | undefined) {
  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(secret)
    );
    return payload;
  } catch (error) {
    toast.error("Please signin again!");
    return {};
  }
}

async function checkJwt(token: string, secret: string | undefined, roles: any) {
  if (token === undefined) {
    return NextResponse.redirect(`${baseUrl}`);
  }

  try {
    const payload = await verify(token, secret);

    if (roles?.length > 0) {
      if (roles.includes(payload?.role)) {
        return NextResponse.next();
      }
      return NextResponse.redirect(`${baseUrl}`);
    }

    return NextResponse.next();
  } catch (e) {
    return NextResponse.redirect(`${baseUrl}`);
  }
}
