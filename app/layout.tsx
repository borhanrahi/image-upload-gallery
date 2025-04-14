import type { Metadata } from "next";
import "./globals.css";
import ThemeRegistry from './components/ThemeRegistry';
import { Toaster } from "react-hot-toast";
import { Geist } from "next/font/google";

const geistSans = Geist({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Modern Image Gallery",
  description: "A beautiful modern image gallery built with Next.js and Material UI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geistSans.className}>
      <body>
        <ThemeRegistry>
          {children}
          <Toaster 
            position="bottom-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#333',
                color: '#fff',
                borderRadius: '8px',
                padding: '16px',
              },
              success: {
                style: {
                  background: '#1E883F',
                },
                iconTheme: {
                  primary: 'white',
                  secondary: '#1E883F'
                }
              },
              error: {
                style: {
                  background: '#E11D48',
                },
                iconTheme: {
                  primary: 'white',
                  secondary: '#E11D48'
                }
              }
            }}
          />
        </ThemeRegistry>
      </body>
    </html>
  );
}
