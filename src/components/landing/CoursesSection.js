"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import styles from "@/app/page.module.css";

export default function CoursesSection() {
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

  const courses = [
    { badge: "Foundation", title: "Class 10", subjects: ["Mathematics", "Science", "Social Science", "Languages"] },
    { badge: "Intermediate", title: "Class 11", subjects: ["Physics", "Chemistry", "Mathematics", "Biology / CS"] },
    { badge: "Advanced", title: "Class 12", subjects: ["Physics", "Chemistry", "Mathematics", "Biology / CS"] }
  ];

  return (
    <section id="courses" className={`${styles.section} ${styles.courses}`}>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <motion.h2 variants={itemVariants} className={styles.sectionTitle}>Our Courses</motion.h2>
        <motion.p variants={itemVariants} className={styles.sectionSubtitle}>Comprehensive coverage for state board and CBSE curriculums.</motion.p>
        
        <motion.div className={styles.coursesGrid} variants={containerVariants}>
          {courses.map((course, i) => (
            <motion.div 
              key={i}
              variants={itemVariants}
              whileHover={{ scale: 1.03, y: -8 }}
              className={`${styles.courseCard}`}
            >
              <div className={styles.courseBadge}>{course.badge}</div>
              <h3 className={styles.courseTitle}>{course.title}</h3>
              <ul className={styles.courseSubjects}>
                {course.subjects.map((sub, j) => (
                  <li key={j}>{sub}</li>
                ))}
              </ul>
              <div className={styles.courseAction}>
                <Link href="/login" className="btn-secondary" style={{width: '100%', display: 'block', textAlign: 'center'}}>
                  Login to Enroll
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
