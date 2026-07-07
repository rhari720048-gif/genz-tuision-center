"use client";
import { useEffect, useState } from 'react';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';

const pageVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function PerformancePage() {
  const [userData, setUserData] = useState(null);
  const [marks, setMarks] = useState([]);
  const [attendance, setAttendance] = useState({ present: 0, total: 0, percentage: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const uData = { id: user.uid, ...userDoc.data() };
          setUserData(uData);
          await fetchPerformance(uData.id);
        }
      }
    });
  }, []);

  const fetchPerformance = async (uid) => {
    try {
      // Get Marks ordered by date to show timeline
      const marksQ = query(collection(db, "marks"), where("studentId", "==", uid));
      const marksSnap = await getDocs(marksQ);
      let mList = [];
      marksSnap.forEach(d => mList.push(d.data()));
      
      // Sort manually since we might not have complex indexes on firestore test mode
      mList.sort((a,b) => (a.date?.seconds || 0) - (b.date?.seconds || 0));
      setMarks(mList);

      const attQ = query(collection(db, "attendance"), where("studentId", "==", uid));
      const attSnap = await getDocs(attQ);
      let pres = 0;
      let total = 0;
      attSnap.forEach(d => {
        total++;
        if(d.data().status === 'Present') pres++;
      });
      setAttendance({ present: pres, total: total, percentage: total === 0 ? 0 : Math.round((pres/total)*100) });
      setLoading(false);
    } catch(err) {
      console.error(err);
      setLoading(false);
    }
  };

  if (loading) return <div style={{display:'flex',justifyContent:'center',padding:'4rem'}}>Loading Analytics...</div>;

  // CHART DATA PREPARATION
  const lineChartData = {
    labels: marks.map((m, i) => `Test ${i+1} (${m.subject})`),
    datasets: [
      {
        label: 'Score Percentage',
        data: marks.map(m => (m.score / m.max) * 100),
        borderColor: 'var(--accent-secondary)',
        backgroundColor: 'rgba(17, 138, 178, 0.2)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top', labels: { color: 'var(--text-primary)' } },
      title: { display: true, text: 'Your Academic Progress Over Time', color: 'var(--text-primary)' },
    },
    scales: {
      y: { min: 0, max: 100, ticks: { color: 'var(--text-secondary)' }, grid: { color: 'rgba(0,0,0,0.05)' } },
      x: { ticks: { color: 'var(--text-secondary)' }, grid: { color: 'rgba(0,0,0,0.05)' } }
    }
  };

  return (
    <motion.div variants={pageVariants} initial="hidden" animate="visible" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', minHeight: '100vh' }}>
      <motion.h1 variants={itemVariants} className="text-gradient" style={{ fontSize: '3rem', marginBottom: '1rem' }}>Performance Analytics</motion.h1>
      <motion.p variants={itemVariants} style={{ color: 'var(--text-secondary)', marginBottom: '3rem' }}>Track your academic progress and attendance over time.</motion.p>

      <motion.div variants={pageVariants} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
        <motion.div variants={itemVariants} whileHover={{ scale: 1.02, y: -4 }} className="glass-panel" style={{ padding: '2rem', borderRadius: '12px' }}>
          <h2>Attendance</h2>
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.5, delay: 0.2 }} style={{ fontSize: '4rem', fontWeight: 'bold', color: 'var(--accent-primary)', margin: '1rem 0' }}>
            {attendance.percentage}%
          </motion.div>
          <p style={{ color: 'var(--text-secondary)' }}>You have attended {attendance.present} out of {attendance.total} classes.</p>
        </motion.div>
        
        <motion.div variants={itemVariants} whileHover={{ scale: 1.02, y: -4 }} className="glass-panel" style={{ padding: '2rem', borderRadius: '12px' }}>
          <h2>Average Score</h2>
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.5, delay: 0.3 }} style={{ fontSize: '4rem', fontWeight: 'bold', color: 'var(--accent-secondary)', margin: '1rem 0' }}>
            {marks.length === 0 ? 0 : Math.round(marks.reduce((a, b) => a + (b.score/b.max)*100, 0) / marks.length)}%
          </motion.div>
          <p style={{ color: 'var(--text-secondary)' }}>Based on {marks.length} assessments.</p>
        </motion.div>
      </motion.div>

      <motion.div variants={itemVariants} className="glass-panel" style={{ padding: '2rem', borderRadius: '12px', height: '500px' }}>
        {marks.length === 0 ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>No marks available to generate charts.</div>
        ) : (
          <Bar options={chartOptions} data={lineChartData} />
        )}
      </motion.div>
    </motion.div>
  );
}
