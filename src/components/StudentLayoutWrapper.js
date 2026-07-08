"use client";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, BookOpen, FileQuestion, Trophy, Menu, X, Calendar, LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import styles from './StudentLayoutWrapper.module.css';
import toast from 'react-hot-toast';

export default function StudentLayoutWrapper({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data());
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setUserData(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    toast.success('Logged out successfully');
    router.push('/login');
  };

  // Hide the layout if on the landing page, login pages, or admin pages
  const isPublicPage = pathname === '/' || pathname === '/login' || pathname === '/admin/login';
  const isAdminPage = pathname.startsWith('/admin');
  const showSidebar = !isPublicPage && !isAdminPage;

  if (!showSidebar) {
    return <>{children}</>;
  }

  return (
    <div className={styles.layoutContainer}>
      {/* SIDEBAR */}
      <aside className={`${styles.sidebar} ${isMobileMenuOpen ? styles.open : ''}`}>
        <div className={styles.brand}>
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <img src="https://ik.imagekit.io/muthurasu/GEN%20Z/GEN_Z_LOGO__2_-removebg-preview.png.png?updatedAt=1782569180718" alt="GenZ Tuition Logo" style={{ height: '40px' }} />
            <span style={{ color: '#2563eb', fontWeight: '800', fontSize: '1.25rem' }}>GenZ Tuition</span>
          </Link>
          <button className={styles.hamburgerBtnClose} onClick={() => setIsMobileMenuOpen(false)}>
            <X size={24} />
          </button>
        </div>
        
        <div className={styles.navItems}>
          <Link href="/dashboard" className={`${styles.navItem} ${pathname === '/dashboard' ? styles.active : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
            <LayoutDashboard size={20} className={styles.navIcon} />
            <span className={styles.navText}>Home</span>
          </Link>
          <Link href="/materials" className={`${styles.navItem} ${pathname === '/materials' ? styles.active : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
            <BookOpen size={20} className={styles.navIcon} />
            <span className={styles.navText}>Materials</span>
          </Link>
          <Link href="/quizzes" className={`${styles.navItem} ${pathname === '/quizzes' ? styles.active : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
            <FileQuestion size={20} className={styles.navIcon} />
            <span className={styles.navText}>Quizzes</span>
          </Link>
          <Link href="/performance" className={`${styles.navItem} ${pathname === '/performance' ? styles.active : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
            <Trophy size={20} className={styles.navIcon} />
            <span className={styles.navText}>Report</span>
          </Link>
          <Link href="/leaderboard" className={`${styles.navItem} ${pathname === '/leaderboard' ? styles.active : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
            <Trophy size={20} className={styles.navIcon} style={{color: 'gold'}} />
            <span className={styles.navText}>Leaderboard</span>
          </Link>
          <Link href="/planner" className={`${styles.navItem} ${pathname === '/planner' ? styles.active : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
            <Calendar size={20} className={styles.navIcon} style={{color: 'var(--accent-secondary)'}} />
            <span className={styles.navText}>Planner</span>
          </Link>
        </div>

        {user && (
          <div style={{ marginTop: 'auto', padding: '1rem', borderTop: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
               <div className={styles.avatarBtn} style={{width: '35px', height: '35px', fontSize: '1rem', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                 {userData?.name ? userData.name.charAt(0).toUpperCase() : (user.email ? user.email.charAt(0).toUpperCase() : 'S')}
               </div>
               <div style={{overflow: 'hidden'}}>
                  <p className={styles.dropdownName} style={{fontSize: '0.9rem', marginBottom: 0, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden'}}>{userData?.name || 'Student'}</p>
                  <p className={styles.dropdownEmail} style={{fontSize: '0.75rem', marginBottom: 0, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden'}}>{user.email}</p>
               </div>
            </div>
            <button className={styles.dropdownLogout} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.6rem 1rem' }} onClick={handleLogout}>
               <LogOut size={16} /> Logout
            </button>
          </div>
        )}
      </aside>

      {/* MAIN CONTENT */}
      <main className={styles.mainContent}>
        
        {/* TOP HEADER */}
        <header className={styles.topHeader}>
          <button className={styles.hamburgerBtn} onClick={() => setIsMobileMenuOpen(true)}>
            <Menu size={24} />
          </button>
        </header>

        <div className={styles.pageContent}>
          {children}
        </div>
      </main>
    </div>
  );
}
