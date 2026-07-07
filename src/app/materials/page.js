"use client";
import { useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query, doc, getDoc } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
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

          const deptMatch = !m.department || m.department === 'All' || String(m.class) === '10' || String(m.department) === String(studentDept) || String(studentDept) === 'General';
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

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', minHeight: '100vh' }}>
      <h1 className="text-gradient" style={{ fontSize: '3rem', marginBottom: '1rem' }}>Study Hub</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Access all your notes, previous papers, and important questions organized by subject.</p>

      {examFilter && (
        <div style={{ background: 'rgba(6, 214, 160, 0.1)', color: 'var(--accent-secondary)', padding: '1rem', borderRadius: '12px', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span><strong>Filter Active:</strong> Showing resources for "{examFilter}"</span>
          <button onClick={() => window.location.href = '/materials'} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer' }}>Clear Filter</button>
        </div>
      )}

      {materials.length === 0 ? (
        <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>No materials uploaded yet.</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '2rem', alignItems: 'start' }}>
          
          {/* FOLDERS SIDEBAR */}
          <div className="glass-panel" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', borderRadius: '12px' }}>
            <h3 style={{ padding: '0.5rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>Subjects</h3>
            {subjects.map(sub => (
              <button 
                key={sub} 
                onClick={() => setActiveSubject(sub)}
                style={{ 
                  padding: '1rem', textAlign: 'left', background: activeSubject === sub ? 'var(--accent-primary)' : 'transparent',
                  color: activeSubject === sub ? 'white' : 'var(--text-primary)', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold'
                }}
              >
                📁 {sub}
              </button>
            ))}
          </div>

          {/* FILES VIEW */}
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2>{activeSubject} Resources</h2>
            </div>
            {materials.filter(m => m.subject === activeSubject).map(m => (
              <a key={m.id} href={m.fileUrl} target="_blank" rel="noopener noreferrer" className={styles.materialCard}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <h3 style={{ color: 'var(--accent-primary)', fontSize: '1.25rem', margin: 0 }}>{m.title}</h3>
                  <div style={{ display: 'flex', gap: '1rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    <span style={{ padding: '4px 8px', background: 'rgba(0,0,0,0.05)', borderRadius: '4px' }}>Class {m.class}</span>
                    <span style={{ padding: '4px 8px', background: 'rgba(0,0,0,0.05)', borderRadius: '4px' }}>{m.type}</span>
                  </div>
                </div>
                <div style={{ background: 'var(--accent-secondary)', color: 'white', padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: 'bold' }}>
                  Open File
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
