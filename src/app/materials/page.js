"use client";
import { useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query, doc, getDoc } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './page.module.css';

export default function MaterialsPage() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSubject, setActiveSubject] = useState(null);
  const [examFilter, setExamFilter] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const userData = userDoc.exists() ? userDoc.data() : null;
        fetchMaterials(userData);
      } else {
        window.location.href = '/login';
      }
    });
  }, []);

  const fetchMaterials = async (userData) => {
    try {
      const q = query(collection(db, "materials"), orderBy('uploadedAt', 'desc'));
      const snap = await getDocs(q);
      let list = [];
      snap.forEach(d => list.push({ id: d.id, ...d.data() }));

      if (userData && userData.role !== 'admin') {
        const studentClass = userData.class;
        const studentDept = userData.department;
        const studentSubjects = userData.subjects ? userData.subjects.toLowerCase() : '';

        list = list.filter(m => {
          const classMatch = !m.class || m.class === 'All' || String(m.class) === String(studentClass);
          if (!classMatch) return false;

          const deptMatch = !m.department || m.department === 'All' || m.department === 'General' || String(m.class) === '10' || String(m.department) === String(studentDept) || String(studentDept) === 'General';
          if (!deptMatch) return false;

          const subjMatch = !m.subject || m.subject === 'All' || !studentSubjects || studentSubjects.includes(m.subject.trim().toLowerCase());
          if (!subjMatch) return false;

          return true;
        });
      }

      const urlParams = new URLSearchParams(window.location.search);
      const exam = urlParams.get('exam');
      if (exam) {
        setExamFilter(exam);
        list = list.filter(m => 
          m.type?.toLowerCase().includes(exam.toLowerCase()) || 
          m.title?.toLowerCase().includes(exam.toLowerCase())
        );
      }

      setMaterials(list);
      
      // Auto-select first subject
      const subjects = [...new Set(list.map(m => m.subject))];
      if(subjects.length > 0) setActiveSubject(subjects[0]);
      
      setLoading(false);
    } catch(err) {
      console.error(err);
      setLoading(false);
    }
  };

  if (loading) return <div style={{display:'flex',justifyContent:'center',padding:'4rem'}}>Loading Study Hub...</div>;

  const subjects = [...new Set(materials.map(m => m.subject))];

  const pageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <motion.div 
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', minHeight: '100vh' }}
    >
      <motion.h1 variants={itemVariants} className="text-gradient" style={{ fontSize: '3rem', marginBottom: '1rem' }}>Study Hub</motion.h1>
      <motion.p variants={itemVariants} style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Access all your notes, previous papers, and important questions organized by subject.</motion.p>

      {examFilter && (
        <motion.div variants={itemVariants} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '1rem', borderRadius: '12px', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span><strong>Filter Active:</strong> Showing resources for "{examFilter}"</span>
          <button onClick={() => window.location.href = '/materials'} className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>Clear Filter</button>
        </motion.div>
      )}

      {materials.length === 0 ? (
        <motion.div variants={itemVariants} className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>No materials uploaded yet.</motion.div>
      ) : (
        <div className={styles.contentGrid}>
          
          {/* FOLDERS SIDEBAR */}
          <motion.div variants={itemVariants} className="glass-panel" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', borderRadius: '12px' }}>
            <h3 style={{ padding: '0.5rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>Subjects</h3>
            {subjects.map(sub => (
              <button 
                key={sub} 
                onClick={() => setActiveSubject(sub)}
                style={{ 
                  padding: '1rem', textAlign: 'left', background: activeSubject === sub ? 'var(--accent-primary)' : 'transparent',
                  color: activeSubject === sub ? 'white' : 'var(--text-primary)', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold',
                  transition: 'all var(--transition-fast)'
                }}
              >
                📁 {sub}
              </button>
            ))}
          </motion.div>

          {/* FILES VIEW */}
          <motion.div variants={itemVariants} style={{ display: 'grid', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2>{activeSubject} Resources</h2>
            </div>
            <AnimatePresence mode="popLayout">
              {materials.filter(m => m.subject === activeSubject).map(m => (
                <motion.a 
                  key={m.id} 
                  href={m.fileUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={styles.materialCard}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  whileHover={{ scale: 1.02, y: -4 }}
                  layout
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <h3 style={{ color: 'var(--text-primary)', fontSize: '1.25rem', margin: 0 }}>{m.title}</h3>
                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                      <span style={{ padding: '4px 8px', background: 'var(--bg-secondary)', borderRadius: '4px', border: '1px solid var(--border-color)' }}>Class {m.class}</span>
                      <span style={{ padding: '4px 8px', background: 'var(--bg-secondary)', borderRadius: '4px', border: '1px solid var(--border-color)' }}>{m.type}</span>
                    </div>
                  </div>
                  <div style={{ background: 'var(--accent-primary)', color: 'white', padding: '0.5rem 1rem', borderRadius: '100px', fontWeight: '600', fontSize: '0.9rem', transition: 'all var(--transition-fast)' }}>
                    Open File
                  </div>
                </motion.a>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
