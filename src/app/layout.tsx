import { Flex, ConfigProvider, theme } from "antd";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Goober",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Flex align="center" justify="space-evenly">
          {children}
        </Flex>
      </body>
    </html>
  );
}
