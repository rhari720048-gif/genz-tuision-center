"use client";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, BookOpen, FileQuestion, Trophy, Menu, X, Calendar } from 'lucide-react';
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
          <Link href="/" className="text-gradient" style={{ textDecoration: 'none' }}>GenZ Tuition</Link>
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

        <div className={styles.sidebarFooter}>
          {user && (
            <div className={styles.profileMenuContainer}>
              <button 
                className={styles.avatarBtn} 
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                {userData?.name ? userData.name.charAt(0).toUpperCase() : (user.email ? user.email.charAt(0).toUpperCase() : 'S')}
              </button>
              <div style={{display: 'flex', flexDirection: 'column', marginLeft: '0.8rem', flex: 1}}>
                 <span style={{fontSize: '0.9rem', fontWeight: 700}}>{userData?.name || 'Student'}</span>
                 <span style={{fontSize: '0.75rem', color: 'var(--text-secondary)'}}>Class {userData?.class || 'N/A'}</span>
              </div>
              
              {dropdownOpen && (
                <div className={styles.dropdownMenu}>
                  <button className={styles.dropdownLogout} onClick={handleLogout}>
                     Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className={styles.mainContent}>
        {/* MOBILE TOP HEADER */}
        <header className={styles.topHeader}>
          <button className={styles.hamburgerBtn} onClick={() => setIsMobileMenuOpen(true)}>
            <Menu size={24} />
          </button>
          <div className={styles.mobileBrand}>
             <Link href="/" className="text-gradient" style={{ textDecoration: 'none', fontWeight: 800 }}>GenZ Tuition</Link>
          </div>
          <div className={styles.headerActions}>
            {user && (
              <div className={styles.profileMenuContainerMobile}>
                <button 
                  className={styles.avatarBtn} 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  {userData?.name ? userData.name.charAt(0).toUpperCase() : (user.email ? user.email.charAt(0).toUpperCase() : 'S')}
                </button>
                
                {dropdownOpen && (
                  <div className={styles.dropdownMenuMobile}>
                    <div className={styles.dropdownInfo}>
                      <p className={styles.dropdownName}>{userData?.name || 'Student'}</p>
                      <p className={styles.dropdownEmail}>{user.email}</p>
                      {userData?.class && <p className={styles.dropdownClass}>Class {userData.class}</p>}
                    </div>
                    <div className={styles.dropdownDivider}></div>
                    <button className={styles.dropdownLogout} onClick={handleLogout}>
                       Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </header>

        <div className={styles.pageContent}>
          {children}
        </div>
      </main>
    </div>
  );
}
