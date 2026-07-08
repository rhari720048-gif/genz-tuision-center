"use client";
import { Users, BookOpen, UserCheck, Activity } from 'lucide-react';
import { motion } from "framer-motion";
import styles from "@/app/page.module.css";

export default function StatsSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
  };

  const stats = [
    { number: "1000+", label: "Enrolled Students", icon: <Users size={32} /> },
    { number: "500+", label: "Premium Materials", icon: <BookOpen size={32} /> },
    { number: "50+", label: "Expert Tutors", icon: <UserCheck size={32} /> },
    { number: "99%", label: "Success Rate", icon: <Activity size={32} /> }
  ];

  return (
    <section id="stats" className={`${styles.section} ${styles.stats}`}>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <motion.h2 variants={itemVariants} className={styles.sectionTitle}>Trusted by Thousands.</motion.h2>
        <motion.p variants={itemVariants} className={styles.sectionSubtitle}>We are more than just a tuition center. We are a complete educational ecosystem tailored for your success.</motion.p>
        
        <div className={styles.statsGrid}>
          {stats.map((stat, i) => (
            <motion.div 
              key={i}
              variants={itemVariants}
              className={styles.luxuryCard}
            >
              <div className={styles.statIcon}>{stat.icon}</div>
              <div className={styles.statNumber}>{stat.number}</div>
              <div className={styles.statLabel}>{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
