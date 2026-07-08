"use client";
import { motion } from "framer-motion";
import styles from "@/app/page.module.css";
import { BookOpen, LineChart, Brain } from "lucide-react";

export default function FeaturesSection() {
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

  const features = [
    { 
      icon: <BookOpen size={32} strokeWidth={1.5} />, 
      title: "Premium Materials", 
      desc: "Instant access to highly-curated, top-tier study notes, PDFs, and reference materials specifically designed for Class 10, 11, and 12." 
    },
    { 
      icon: <Brain size={32} strokeWidth={1.5} />, 
      title: "AI-Powered Quizzes", 
      desc: "Our proprietary AI engine generates customized quizzes based on your weaknesses, perfectly simulating real exam conditions." 
    },
    { 
      icon: <LineChart size={32} strokeWidth={1.5} />, 
      title: "Advanced Analytics", 
      desc: "Track your academic trajectory with precision. Visualize your progress through beautiful, detailed performance charts and metrics." 
    }
  ];

  return (
    <section id="features" className={styles.section}>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <motion.h2 variants={itemVariants} className={styles.sectionTitle}>
          Built for Excellence
        </motion.h2>
        <motion.p variants={itemVariants} className={styles.sectionSubtitle}>
          Every feature is meticulously designed to accelerate your learning and guarantee superior results.
        </motion.p>
        
        <motion.div className={styles.featuresGrid} variants={containerVariants}>
          {features.map((feature, i) => (
            <motion.div 
              key={i}
              variants={itemVariants}
              className={styles.featureCard}
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
