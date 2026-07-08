"use client";
import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, limit, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { motion } from 'framer-motion';
import { Sparkles, BookOpen } from 'lucide-react';
import Link from 'next/link';

export default function Recommendations({ userData, marks }) {
  const [recommendedMaterials, setRecommendedMaterials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userData && marks) {
      generateRecommendations();
    }
  }, [userData, marks]);

  const generateRecommendations = async () => {
    try {
      // Find weak subjects (score < 70%)
      let weakSubjects = [];
      marks.forEach(m => {
        const percentage = (m.score / m.max) * 100;
        if (percentage < 70) {
          // extract subject from "Quiz: Math Test" -> "Math" or just take the whole string if it's not a quiz
          const subjectClean = m.subject.replace('Quiz: ', '').split(' ')[0]; // rough heuristic
          weakSubjects.push(subjectClean);
        }
      });

      // Fetch materials
      let matQuery;
      if (userData.class === '10') {
        matQuery = query(collection(db, "materials"), where("class", "==", "10"), limit(5));
      } else {
        matQuery = query(collection(db, "materials"), where("class", "==", userData.class), where("department", "in", [userData.department, "General"]), limit(5));
      }

      const snap = await getDocs(matQuery);
      const allMats = [];
      snap.forEach(d => allMats.push({ id: d.id, ...d.data() }));

      // Sort: prioritize materials that match weak subjects
      if (weakSubjects.length > 0) {
        allMats.sort((a, b) => {
          const aIsWeak = weakSubjects.some(ws => a.subject.toLowerCase().includes(ws.toLowerCase()));
          const bIsWeak = weakSubjects.some(ws => b.subject.toLowerCase().includes(ws.toLowerCase()));
          return (bIsWeak ? 1 : 0) - (aIsWeak ? 1 : 0);
        });
      }

      setRecommendedMaterials(allMats.slice(0, 3)); // show top 3
    } catch (err) {
      console.error("Failed to fetch recommendations", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return null;
  if (recommendedMaterials.length === 0) return null;

  return (
    <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} style={{ marginTop: '2rem' }}>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)' }}>
        <Sparkles size={24} color="var(--accent-primary)" /> AI Recommended Path
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
        {recommendedMaterials.map(mat => (
          <motion.div key={mat.id} whileHover={{ scale: 1.02 }} className="glass-panel" style={{ padding: '1.5rem', borderRadius: '12px', borderLeft: '4px solid var(--accent-secondary)' }}>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Because of your recent scores</div>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>{mat.title}</h3>
            <Link href={mat.fileUrl} target="_blank" className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
              <BookOpen size={16} /> Study Now
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
