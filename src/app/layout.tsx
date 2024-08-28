import "./globals.css";
import type { Metadata } from "next";
import { Roboto } from "next/font/google";

// const nunitoSans = Nunito_Sans({ subsets: ['latin'] })
const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
});

export const metadata: Metadata = {
  title: "division3D - We bring your ideas to life.",
  description: "The first prototype for division3D",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={roboto.className}>{children}</body>
    </html>
  );
}
