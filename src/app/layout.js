import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const font = Plus_Jakarta_Sans({ 
  subsets: ["latin"],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-main',
});

export const metadata = {
  title: "GenZ Tuition Center | Student Portal",
  description: "Modern Student Portal for GenZ Tuition Center with study materials, quizzes, and performance analytics.",
  manifest: "/manifest.json",
};

import StudentLayoutWrapper from "@/components/StudentLayoutWrapper";
import { Toaster } from "react-hot-toast";

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={font.variable}>
      <body className={font.className}>
        <Toaster position="top-right" toastOptions={{ duration: 4000, style: { background: '#333', color: '#fff' } }} />
        <StudentLayoutWrapper>
          {children}
        </StudentLayoutWrapper>
      </body>
    </html>
  );
}
