"use client";
import { useState, useEffect } from 'react';
import { Users, BookOpen, UserCheck, Activity } from 'lucide-react';
import { motion } from "framer-motion";
import styles from "@/app/page.module.css";
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function StatsSection() {
  const [studentCount, setStudentCount] = useState(0);
  const [materialCount, setMaterialCount] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const studentSnap = await getDocs(query(collection(db, "users"), where("role", "==", "student")));
        setStudentCount(studentSnap.size);
        
        const materialSnap = await getDocs(collection(db, "materials"));
        setMaterialCount(materialSnap.size);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };
    fetchStats();
  }, []);

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
    { number: studentCount.toString(), label: "Enrolled Students", icon: <Users size={32} /> },
    { number: materialCount.toString(), label: "Premium Materials", icon: <BookOpen size={32} /> },
    { number: "2", label: "Expert Tutors", icon: <UserCheck size={32} /> },
    { number: "100%", label: "Success Rate", icon: <Activity size={32} /> }
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
        <motion.h2 variants={itemVariants} className={styles.sectionTitle}>Trusted by Students.</motion.h2>
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
