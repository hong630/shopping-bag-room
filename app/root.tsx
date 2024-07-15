import {
    Links,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
} from "@remix-run/react";

import type { LinksFunction } from "@remix-run/node"
import sharedStyles from "~/styles/shared.css?url"

export const links: LinksFunction = () => [
    { rel: "stylesheet", href: sharedStyles },
    { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Gothic+A1&display=swap" }
];


export function Layout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <head>
            <title>우리 장바구니</title>
            <meta charSet="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <Meta />
            <Links />
        </head>
        <body>
        {children}
        <ScrollRestoration />
        <Scripts />
        </body>
        </html>
    );
}

export default function App() {
    return <Outlet />;
}
