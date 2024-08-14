import { withAuth } from "next-auth/middleware";
import { AUTH_ROUTES } from "./routes";

export default withAuth({
    callbacks: {
        authorized: ({ req, token }) => {
            const { nextUrl } = req;
            const isLoggedIn = !!token;

            const isAuthRoute = AUTH_ROUTES.includes(nextUrl.pathname);
            if (isAuthRoute) {
                return true;
            }

            if (isLoggedIn) {
                return true;
            }

            return false;
        }
    }
})

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"]
}
