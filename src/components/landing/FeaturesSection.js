"use client";
import { motion } from "framer-motion";
import styles from "@/app/page.module.css";

export default function FeaturesSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <section id="features" className={styles.section}>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <motion.h2 variants={itemVariants} className={`${styles.sectionTitle} text-gradient`}>
          Everything You Need to Succeed
        </motion.h2>
        <motion.p variants={itemVariants} className={styles.sectionSubtitle}>
          Our platform is packed with powerful features designed to make learning engaging and effective.
        </motion.p>
        
        <motion.div className={styles.featuresGrid} variants={containerVariants}>
          {[
            { icon: "📚", title: "Premium Materials", desc: "Get instant access to high-quality notes, PDFs, and reference books for Class 10, 11, and 12." },
            { icon: "⏱️", title: "Interactive Quizzes", desc: "Test your knowledge with daily and weekly timed quizzes that simulate real exam conditions." },
            { icon: "📈", title: "Performance Tracking", desc: "Monitor your progress over time with detailed analytics, attendance tracking, and leaderboards." },
            { icon: "🎯", title: "Goal Setting", desc: "Set personal academic goals and let our platform guide you with a customized study plan." }
          ].map((feature, i) => (
            <motion.div 
              key={i}
              variants={itemVariants}
              whileHover={{ scale: 1.02, y: -4 }}
              className={`glass-panel ${styles.featureCard} ${styles[`bentoCard${i}`]}`}
            >
              <div className={styles.featureIcon}>{feature.icon}</div>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureDesc}>{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
