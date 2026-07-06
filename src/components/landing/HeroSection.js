import Link from "next/link";
import styles from "@/app/page.module.css";

export default function HeroSection() {
  return (
    <section className={`${styles.section} ${styles.hero}`}>
      <div className={`${styles.heroContent} animate-fade-in-up`}>
        <h1 className={`${styles.title} text-gradient`}>GenZ Tuition Center</h1>
        <p className={styles.description}>
          The ultimate learning platform designed for the next generation. Access premium study materials, take interactive quizzes, track your performance, and dominate your exams.
        </p>
        <div className={styles.actions}>
          <Link href="/login" className="btn-primary">
            Student Login
          </Link>
          <Link href="#features" className="btn-secondary">
            Explore Features
          </Link>
        </div>
      </div>
    </section>
  );
}
