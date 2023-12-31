import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const url = request.nextUrl;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const pathname = url.pathname;
  const searchParams = new URLSearchParams(url.searchParams);
  const responseCookies = response.cookies;
  const requestCookies = request.cookies;
  const next = searchParams.get("next") || "/";
  const accessToken = requestCookies.get("access_token");

  let user: User | undefined;

  if (accessToken) {
    try {
      const headers = new Headers();
      headers.append(
        "Cookie",
        "access_token=" + encodeURIComponent(accessToken.value)
      );
      headers.append("baseurl", `${apiUrl}`);

      const response = await fetch(`${apiUrl}/me`, {
        method: "GET",
        headers,
      });

      const responseData = await response.json();

      if (responseData.statusCode !== 401) {
        user = responseData;
        responseCookies.set("email", responseData.email);
        responseCookies.set("isLoggedIn", "true");
      } else {
        requestCookies.getAll().map((cookie) => {
          if (cookie.name !== "email") {
            responseCookies.delete(cookie.name);
          }
        });
      }
    } catch (_) {}
  } else {
    responseCookies.delete("isLoggedIn");
  }

  const isAuth = user !== undefined;

  if (isAuth && !user?.isVerified && pathname !== "/email-verification") {
    const redirectUrl = new URL("/email-verification", url);
    return NextResponse.redirect(redirectUrl);
  }

  if (isAuth && user?.isVerified && pathname === "/email-verification") {
    const redirectUrl = new URL("/", url);
    return NextResponse.redirect(redirectUrl);
  }

  if (
    isAuth &&
    (pathname.startsWith("/login") ||
      pathname.startsWith("/password/forgot") ||
      pathname.startsWith("/password/reset") ||
      pathname.startsWith("/deactivated"))
  ) {
    const redirectUrl = new URL(`/redirect?to=${next}`, url);
    return NextResponse.redirect(redirectUrl);
  }

  if (
    !isAuth &&
    pathname !== "/login" &&
    pathname !== "/password/forgot" &&
    pathname !== "/password/reset" &&
    pathname !== "/deactivated"
  ) {
    const redirectUrl = new URL(
      pathname !== "/" ? `/login?next=${pathname}` : "/login",
      url
    );
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export const config = {
  matcher: "/((?!api|_next/static|favicon.ico).*)",
};
