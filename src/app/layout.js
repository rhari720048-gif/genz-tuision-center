import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "GenZ Tuition Center | Student Portal",
  description: "Modern Student Portal for GenZ Tuition Center with study materials, quizzes, and performance analytics.",
  manifest: "/manifest.json",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
