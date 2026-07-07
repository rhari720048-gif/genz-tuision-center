"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import styles from "@/app/page.module.css";

export default function HeroSection() {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <section className={`${styles.section} ${styles.hero}`}>
      <div className={styles.heroOrb}></div>
      <motion.div 
        className={styles.heroContent}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 variants={itemVariants} className={`${styles.title} text-gradient`}>
          GenZ Tuition Center
        </motion.h1>
        <motion.p variants={itemVariants} className={styles.description}>
          The ultimate learning platform designed for the next generation. Access premium study materials, take interactive quizzes, track your performance, and dominate your exams.
        </motion.p>
        <motion.div variants={itemVariants} className={styles.actions}>
          <Link href="/login" className="btn-primary">
            Student Login
          </Link>
          <Link href="#features" className="btn-secondary">
            Explore Features
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
