import "./globals.css";
import "./data-tables-css.css";
import "./satoshi.css";
import { CookiesProvider } from "next-client-cookies/server";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <CookiesProvider>{children}</CookiesProvider>
      </body>
    </html>
  );
}
