import Link from "next/link";
import styles from "@/app/page.module.css";

export default function CoursesSection() {
  return (
    <section id="courses" className={`${styles.section} ${styles.courses}`}>
      <h2 className={styles.sectionTitle}>Our Courses</h2>
      <p className={styles.sectionSubtitle}>Comprehensive coverage for state board and CBSE curriculums.</p>
      
      <div className={styles.coursesGrid}>
        <div className={`glass-panel ${styles.courseCard}`}>
          <div className={styles.courseBadge}>Foundation</div>
          <h3 className={styles.courseTitle}>Class 10</h3>
          <ul className={styles.courseSubjects}>
            <li>Mathematics</li>
            <li>Science</li>
            <li>Social Science</li>
            <li>Languages</li>
          </ul>
          <div className={styles.courseAction}>
            <Link href="/login" className="btn-secondary" style={{width: '100%', display: 'block', textAlign: 'center'}}>Login to Enroll</Link>
          </div>
        </div>

        <div className={`glass-panel ${styles.courseCard}`}>
          <div className={styles.courseBadge}>Intermediate</div>
          <h3 className={styles.courseTitle}>Class 11</h3>
          <ul className={styles.courseSubjects}>
            <li>Physics</li>
            <li>Chemistry</li>
            <li>Mathematics</li>
            <li>Biology / CS</li>
          </ul>
          <div className={styles.courseAction}>
            <Link href="/login" className="btn-secondary" style={{width: '100%', display: 'block', textAlign: 'center'}}>Login to Enroll</Link>
          </div>
        </div>

        <div className={`glass-panel ${styles.courseCard}`}>
          <div className={styles.courseBadge}>Advanced</div>
          <h3 className={styles.courseTitle}>Class 12</h3>
          <ul className={styles.courseSubjects}>
            <li>Physics</li>
            <li>Chemistry</li>
            <li>Mathematics</li>
            <li>Biology / CS</li>
          </ul>
          <div className={styles.courseAction}>
            <Link href="/login" className="btn-secondary" style={{width: '100%', display: 'block', textAlign: 'center'}}>Login to Enroll</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
