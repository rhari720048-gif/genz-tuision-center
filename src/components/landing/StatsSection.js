"use client";
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
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
  };

  const stats = [
    { number: "1000+", label: "Enrolled" },
    { number: "500+", label: "Materials" },
    { number: "50+", label: "Tutors" },
    { number: "99%", label: "Success" }
  ];

  return (
    <section id="about" className={`${styles.section} ${styles.about}`}>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <motion.h2 variants={itemVariants} className={styles.sectionTitle}>Why Choose Us?</motion.h2>
        <motion.p variants={itemVariants} className={styles.sectionSubtitle}>We are more than just a tuition center. We are a complete educational ecosystem tailored for your success.</motion.p>
        
        <div className={styles.aboutGrid}>
          <motion.div className={styles.aboutText} variants={itemVariants}>
            <p>
              At GenZ Tuition Center, we believe that education should evolve with technology. That's why we've built a modern, intuitive platform that brings the classroom to your fingertips.
            </p>
            <p>
              Whether you're preparing for board exams or just want to stay ahead of the curve, our expert-curated materials and data-driven performance tracking will guide you every step of the way.
            </p>
          </motion.div>
          
          <motion.div className={styles.aboutStats} variants={containerVariants}>
            {stats.map((stat, i) => (
              <motion.div 
                key={i}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                className={`${styles.statCard}`}
              >
                <div className={styles.statNumber}>{stat.number}</div>
                <div className={styles.statLabel}>{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
