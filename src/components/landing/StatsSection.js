import styles from "@/app/page.module.css";

export default function StatsSection() {
  return (
    <section id="about" className={`${styles.section} ${styles.about}`}>
      <h2 className={styles.sectionTitle}>Why Choose Us?</h2>
      <p className={styles.sectionSubtitle}>We are more than just a tuition center. We are a complete educational ecosystem tailored for your success.</p>
      
      <div className={styles.aboutGrid}>
        <div className={styles.aboutText}>
          <p>
            At GenZ Tuition Center, we believe that education should evolve with technology. That's why we've built a modern, intuitive platform that brings the classroom to your fingertips.
          </p>
          <p>
            Whether you're preparing for board exams or just want to stay ahead of the curve, our expert-curated materials and data-driven performance tracking will guide you every step of the way.
          </p>
        </div>
        <div className={styles.aboutStats}>
          <div className={`glass-panel ${styles.statCard}`}>
            <div className={styles.statNumber}>1000+</div>
            <div className={styles.statLabel}>Enrolled</div>
          </div>
          <div className={`glass-panel ${styles.statCard}`}>
            <div className={styles.statNumber}>500+</div>
            <div className={styles.statLabel}>Materials</div>
          </div>
          <div className={`glass-panel ${styles.statCard}`}>
            <div className={styles.statNumber}>50+</div>
            <div className={styles.statLabel}>Tutors</div>
          </div>
          <div className={`glass-panel ${styles.statCard}`}>
            <div className={styles.statNumber}>99%</div>
            <div className={styles.statLabel}>Success</div>
          </div>
        </div>
      </div>
    </section>
  );
}
