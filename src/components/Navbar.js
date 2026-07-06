"use client";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import styles from './Navbar.module.css';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  // Hide the portal links if on the landing page or login pages
  const isPublicPage = pathname === '/' || pathname === '/login' || pathname === '/admin/login';
  const isAdminPage = pathname.startsWith('/admin');
  const showStudentLinks = !isPublicPage && !isAdminPage;

  return (
    <nav className={`glass-panel ${styles.navbar}`}>
      <div className={styles.logo}>
        <Link href="/" className="text-gradient">
          GenZ Tuition
        </Link>
      </div>
      
      {showStudentLinks && (
        <div className={styles.links}>
          <Link href="/dashboard" className={styles.link}>Dashboard</Link>
          <Link href="/materials" className={styles.link}>Materials</Link>
          <Link href="/quizzes" className={styles.link}>Quizzes</Link>
          <Link href="/performance" className={styles.link}>Performance</Link>
        </div>
      )}

      {!isAdminPage && (
        <div className={styles.navActions}>
          {user ? (
            <button className="btn-secondary" onClick={handleLogout}>Log Out</button>
          ) : (
            pathname !== '/login' && <Link href="/login" className="btn-secondary">Log In</Link>
          )}
        </div>
      )}
    </nav>
  );
}
