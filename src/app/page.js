import styles from "./page.module.css";
import HeroSection from "@/components/landing/HeroSection";
import StatsSection from "@/components/landing/StatsSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import CtaSection from "@/components/landing/CtaSection";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <div className={styles.page}>
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <CtaSection />
      <Footer />
    </div>
  );
}
