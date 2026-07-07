"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import styles from "@/app/page.module.css";

export default function CtaSection() {
  return (
    <section className={`${styles.section} ${styles.cta}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <h2 className={`${styles.sectionTitle} text-gradient`}>Ready to Transform Your Learning?</h2>
        <p className={styles.sectionSubtitle} style={{marginBottom: '3rem'}}>
          Join GenZ Tuition Center today and get access to all our exclusive student portal features.
        </p>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link href="/login" className="btn-primary" style={{fontSize: '1.25rem', padding: '1.2rem 3rem'}}>
            Go to Student Login
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
