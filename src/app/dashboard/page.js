"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import styles from './page.module.css';

export default function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [marks, setMarks] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Fetch user profile
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const uData = { id: user.uid, ...userDoc.data() };
          setUserData(uData);
          await fetchDashboardData(uData);
        } else {
          setUserData({ name: user.email?.split('@')[0] || 'Student', role: 'student', id: user.uid });
        }
      } else {
        router.push('/login');
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  const fetchDashboardData = async (uData) => {
    try {
      // Fetch Marks
      const marksQ = query(collection(db, "marks"), where("studentId", "==", uData.id));
      const marksSnap = await getDocs(marksQ);
      const mList = [];
      marksSnap.forEach(d => mList.push(d.data()));
      setMarks(mList);

      // Fetch Attendance
      const attQ = query(collection(db, "attendance"), where("studentId", "==", uData.id));
      const attSnap = await getDocs(attQ);
      let pres = 0;
      let total = 0;
      attSnap.forEach(d => {
        total++;
        if(d.data().status === 'Present') pres++;
      });
      setAttendance({ present: pres, total: total, percentage: total === 0 ? 0 : Math.round((pres/total)*100) });

      // Fetch Notifications
      const notifQ = query(collection(db, "notifications"));
      const notifSnap = await getDocs(notifQ);
      const nList = [];
      notifSnap.forEach(d => nList.push(d.data()));
      setNotifications(nList);
    } catch(err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>Loading Dashboard...</div>;
  }

  const displayClass = userData?.class ? `Class ${userData.class}` : 'Loading Class...';
  const displayDept = userData?.department ? ` - ${userData.department}` : '';
  const fullClassString = `${displayClass}${displayDept}`;

  const getInitials = (name) => name ? name.substring(0, 2).toUpperCase() : "ST";

  const examFolders = [
    { name: "1st Mid Term", icon: "📁" },
    { name: "Quarterly Exam", icon: "📁" },
    { name: "2nd Mid Term", icon: "📁" },
    { name: "Half Yearly Exam", icon: "📁" },
    { name: "3rd Mid Term", icon: "📁" },
    { name: "Revision Exams", icon: "📁" },
    { name: "Annual / Public Exam", icon: "🎓" }
  ];

  return (
    <div className={styles.dashboardContainer}>
      
      {/* Profile Section */}
      <section className={styles.profileWidget}>
        <div className={styles.avatar}>{getInitials(userData?.name)}</div>
        <div className={styles.profileInfo}>
          <h1>Welcome back, {userData?.name || 'Student'}!</h1>
          <p>{fullClassString} | Portal Access: {userData?.role?.toUpperCase()}</p>
        </div>
      </section>

      <div className={styles.dashboardGrid}>
        <div className={styles.mainContent}>
          
          <div className={styles.metricsRow}>
            <div className={styles.metricCard}>
              <div className={styles.metricHeader}><span className={styles.metricIcon}>📅</span> Attendance</div>
              <div className={styles.metricValue}>{attendance.total === 0 ? 'N/A' : `${attendance.percentage}%`}</div>
              <div className={styles.metricSubtext}>{attendance.present}/{attendance.total} Classes Attended</div>
            </div>
            
            <div className={styles.metricCard}>
              <div className={styles.metricHeader}><span className={styles.metricIcon}>🏆</span> Total Score</div>
              <div className={styles.metricValue}>{userData?.totalScore || 0}</div>
              <div className={styles.metricSubtext}>Keep learning!</div>
            </div>
          </div>

          <section className={styles.foldersSection}>
            <h2 className={styles.sectionHeader}>{userData?.class ? `Class ${userData.class} Exams` : 'Exams'}</h2>
            <div className={styles.foldersGrid}>
              {examFolders.map((exam, index) => (
                <div key={index} className={styles.folderCard}>
                  <div className={styles.folderIcon}>{exam.icon}</div>
                  <div className={styles.folderName}>{exam.name}</div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className={styles.sidebar}>
          <section className={styles.progressWidget}>
            <h2 className={styles.sectionHeader}>Progress Report</h2>
            <p className={styles.progressText}>
              {marks.length > 0 ? "You have records in the system. Keep up the good work and focus on subjects with lower scores!" : "Your progress report will appear here once you complete some assessments."}
            </p>
          </section>

          <section className={styles.notificationWidget}>
            <h2 className={styles.sectionHeader}>Notifications</h2>
            <div className={styles.notificationList}>
              {notifications.length === 0 ? <p>No recent notifications.</p> : notifications.map((n, i) => (
                <div key={i} className={styles.notificationItem}>
                  <div className={styles.notifIcon}>📢</div>
                  <div className={styles.notifContent}>
                    <h4>{n.title}</h4>
                    <p>{n.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
