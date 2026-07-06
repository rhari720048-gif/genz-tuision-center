import Link from "next/link";
import styles from "@/app/page.module.css";

export default function CtaSection() {
  return (
    <section className={`${styles.section} ${styles.cta}`}>
      <h2 className={`${styles.sectionTitle} text-gradient`}>Ready to Transform Your Learning?</h2>
      <p className={styles.sectionSubtitle} style={{marginBottom: '3rem'}}>
        Join GenZ Tuition Center today and get access to all our exclusive student portal features.
      </p>
      <Link href="/login" className="btn-primary" style={{fontSize: '1.25rem', padding: '1.2rem 3rem'}}>
        Go to Student Login
      </Link>
    </section>
  );
}
