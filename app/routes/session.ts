import {createCookieSessionStorage} from "@remix-run/node";
import { v4 as uuidv4 } from 'uuid';

const sessionSecret = process.env.REACT_APP_SESSION_SECRET || uuidv4();

export const { getSession, commitSession, destroySession } = createCookieSessionStorage({
    cookie: {
        name: "session",
        secure: process.env.NODE_ENV === "production",
        secrets: [sessionSecret],
        sameSite: "lax",
        path: "/",
        httpOnly: true,
    },
});

export async function getUserSession(request: Request) {
    const session = await getSession(request.headers.get("Cookie"));
    const user = session.get("user");

    return {
        user: user || null,
        isLoggedIn: !!user,
    };
}