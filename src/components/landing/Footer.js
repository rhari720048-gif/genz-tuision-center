import Link from "next/link";
import styles from "@/app/page.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerGrid}>
        <div className={styles.footerBrand}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
            <img src="https://ik.imagekit.io/muthurasu/GEN%20Z/GEN_Z_LOGO__2_-removebg-preview.png.png?updatedAt=1782569180718" alt="GenZ Tuition Logo" style={{ height: '50px', display: 'block' }} />
            <span style={{ color: '#2563eb', fontWeight: '800', fontSize: '1.5rem' }}>GenZ Tuition</span>
          </div>
          <p>Empowering students with modern educational tools and expert guidance to achieve academic excellence.</p>
        </div>
        <div className={styles.footerLinks}>
          <h3>Quick Links</h3>
          <ul>
            <li><Link href="#about">About Us</Link></li>
            <li><Link href="#features">Features</Link></li>
            <li><Link href="#courses">Courses</Link></li>
            <li><Link href="/login">Student Login</Link></li>
            <li><Link href="/admin/login">Admin Portal</Link></li>
          </ul>
        </div>
        <div className={styles.footerLinks}>
          <h3>Contact Us</h3>
          <ul>
            <li>Email: info@genzneuralx.com</li>
            <li>Phone: +91 7871803642</li>
            <li>Location: sivakasi, Tamil Nadu</li>
          </ul>
        </div>
      </div>
      <div className={styles.footerBottom}>
        &copy; {new Date().getFullYear()} GenZ Tuition Center. All rights reserved.
      </div>
    </footer>
  );
}
