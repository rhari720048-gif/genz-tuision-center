"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import styles from "@/app/page.module.css";

export default function CtaSection() {
  return (
    <section className={styles.cta}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <h2 className={styles.ctaTitle}>Ready to begin?</h2>
        <p className={styles.sectionSubtitle} style={{marginBottom: '3rem'}}>
          Join GenZ Tuition Center today and get instant access to our exclusive student portal.
        </p>
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <Link href="/login" className="btn-primary" style={{fontSize: '1.2rem', padding: '1.2rem 3rem'}}>
            Enter Student Portal <ArrowRight size={20} style={{ marginLeft: '0.5rem' }} />
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
