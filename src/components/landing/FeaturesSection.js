import styles from "@/app/page.module.css";

export default function FeaturesSection() {
  return (
    <section id="features" className={styles.section}>
      <h2 className={`${styles.sectionTitle} text-gradient`}>Everything You Need to Succeed</h2>
      <p className={styles.sectionSubtitle}>Our platform is packed with powerful features designed to make learning engaging and effective.</p>
      
      <div className={styles.featuresGrid}>
        <div className={`glass-panel ${styles.featureCard} animate-float`} style={{animationDelay: '0s'}}>
          <div className={styles.featureIcon}>📚</div>
          <h3 className={styles.featureTitle}>Premium Materials</h3>
          <p className={styles.featureDesc}>Get instant access to high-quality notes, PDFs, and reference books for Class 10, 11, and 12.</p>
        </div>
        
        <div className={`glass-panel ${styles.featureCard} animate-float`} style={{animationDelay: '0.2s'}}>
          <div className={styles.featureIcon}>⏱️</div>
          <h3 className={styles.featureTitle}>Interactive Quizzes</h3>
          <p className={styles.featureDesc}>Test your knowledge with daily and weekly timed quizzes that simulate real exam conditions.</p>
        </div>
        
        <div className={`glass-panel ${styles.featureCard} animate-float`} style={{animationDelay: '0.4s'}}>
          <div className={styles.featureIcon}>📈</div>
          <h3 className={styles.featureTitle}>Performance Tracking</h3>
          <p className={styles.featureDesc}>Monitor your progress over time with detailed analytics, attendance tracking, and leaderboards.</p>
        </div>
        
        <div className={`glass-panel ${styles.featureCard} animate-float`} style={{animationDelay: '0.6s'}}>
          <div className={styles.featureIcon}>🎯</div>
          <h3 className={styles.featureTitle}>Goal Setting</h3>
          <p className={styles.featureDesc}>Set personal academic goals and let our platform guide you with a customized study plan.</p>
        </div>
      </div>
    </section>
  );
}
