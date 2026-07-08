"use client";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, BookOpen, FileQuestion, Trophy } from 'lucide-react';
import { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import styles from './Navbar.module.css';
import toast from 'react-hot-toast';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

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

  // Hide the portal links if on the landing page or login pages
  const isPublicPage = pathname === '/' || pathname === '/login' || pathname === '/admin/login';
  const isAdminPage = pathname.startsWith('/admin');
  const showStudentLinks = !isPublicPage && !isAdminPage;

  if (isAdminPage && pathname !== '/admin/login') {
    return null;
  }

  return (
    <div className={styles.navbarWrapper}>
      <nav className={`${styles.navbar}`}>

      
      {showStudentLinks && (
        <div className={styles.links}>
          <Link href="/dashboard" className={`${styles.link} ${pathname === '/dashboard' ? styles.active : ''}`}>
            <LayoutDashboard size={22} className={styles.navIcon} />
            <span className={styles.navText}>Home</span>
          </Link>
          <Link href="/materials" className={`${styles.link} ${pathname === '/materials' ? styles.active : ''}`}>
            <BookOpen size={22} className={styles.navIcon} />
            <span className={styles.navText}>Materials</span>
          </Link>
          <Link href="/quizzes" className={`${styles.link} ${pathname === '/quizzes' ? styles.active : ''}`}>
            <FileQuestion size={22} className={styles.navIcon} />
            <span className={styles.navText}>Quizzes</span>
          </Link>
          <Link href="/performance" className={`${styles.link} ${pathname === '/performance' ? styles.active : ''}`}>
            <Trophy size={22} className={styles.navIcon} />
            <span className={styles.navText}>Report</span>
          </Link>
          <Link href="/leaderboard" className={`${styles.link} ${pathname === '/leaderboard' ? styles.active : ''}`}>
            <Trophy size={22} className={styles.navIcon} style={{color: 'gold'}} />
            <span className={styles.navText}>Leaderboard</span>
          </Link>
          <Link href="/planner" className={`${styles.link} ${pathname === '/planner' ? styles.active : ''}`}>
            <BookOpen size={22} className={styles.navIcon} style={{color: 'var(--accent-secondary)'}} />
            <span className={styles.navText}>Planner</span>
          </Link>
        </div>
      )}

      {!isAdminPage && (
        <div className={styles.navActions}>
          {!user && pathname !== '/login' && (
            <Link href="/login" className="btn-secondary">Log In</Link>
          )}
          {user && (
            <div className={styles.profileMenuContainer}>
              <button 
                className={styles.avatarBtn} 
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                {userData?.name ? userData.name.charAt(0).toUpperCase() : (user.email ? user.email.charAt(0).toUpperCase() : 'S')}
              </button>
              
              {dropdownOpen && (
                <div className={styles.dropdownMenu}>
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
      )}

      <div className={styles.logo}>
        <Link href="/" className="text-gradient" style={{marginRight: 0, marginLeft: '2rem'}}>
          GenZ Tuition
        </Link>
      </div>
    </nav>
    </div>
  );
}
