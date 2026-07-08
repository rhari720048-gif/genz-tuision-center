"use client";
import Link from "next/link";
import { Sparkles, ArrowRight } from 'lucide-react';
import { motion } from "framer-motion";
import styles from "@/app/page.module.css";

export default function HeroSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
  };

  const floatVariants = {
    animate: {
      y: [0, -10, 0],
      transition: { duration: 5, repeat: Infinity, ease: "easeInOut" }
    }
  };

  return (
    <section className={`${styles.section} ${styles.hero}`}>
      <motion.div 
        className={styles.heroContent}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 variants={itemVariants} className={styles.title}>
          Education for the <br />
          <span className={styles.titleHighlight}>Next Generation.</span>
        </motion.h1>
        
        <motion.p variants={itemVariants} className={styles.description}>
          Experience the ultimate learning platform. Access premium study materials, take interactive AI-generated quizzes, and dominate your exams with data-driven insights.
        </motion.p>
        
        <motion.div variants={itemVariants} className={styles.actions}>
          <Link href="/login" className="btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
            Enter Portal
            <ArrowRight size={20} style={{ marginLeft: '0.5rem' }} />
          </Link>
          <Link href="#features" className="btn-secondary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
            Explore Features
          </Link>
        </motion.div>

        {/* Floating Luxury Element */}
        <motion.div variants={floatVariants} animate="animate" className={styles.heroLuxuryCard}>
          <div className={styles.heroLuxuryCardIcon}><Sparkles size={20} /></div>
          <div className={styles.heroLuxuryCardText}>AI-Powered Learning</div>
        </motion.div>
      </motion.div>
    </section>
  );
}
