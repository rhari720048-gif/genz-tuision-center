"use client";
import { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { motion } from 'framer-motion';
import { Trophy, Medal, Award } from 'lucide-react';

export default function LeaderboardPage() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const q = query(collection(db, "users"), orderBy("points", "desc"), limit(10));
        const snap = await getDocs(q);
        const list = [];
        snap.forEach(d => {
          if (d.data().role === 'student' && d.data().points > 0) {
            list.push({ id: d.id, ...d.data() });
          }
        });
        setLeaders(list);
      } catch (err) {
        console.error("Failed to fetch leaderboard", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  if (loading) return <div style={{display:'flex',justifyContent:'center',padding:'4rem'}}>Loading Leaderboard...</div>;

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', minHeight: '100vh' }}>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <Trophy size={64} style={{ color: 'gold', marginBottom: '1rem' }} />
        <h1 className="text-gradient" style={{ fontSize: '3rem' }}>Global Leaderboard</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Top students based on quiz performance and activity.</p>
      </motion.div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {leaders.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No leaders yet. Be the first to earn points!</p>
        ) : (
          leaders.map((student, index) => (
            <motion.div 
              key={student.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, translateX: 5 }}
              className="glass-panel"
              style={{ 
                padding: '2rem 1.5rem', 
                borderRadius: '16px', 
                display: 'flex', 
                alignItems: 'center',
                justifyContent: 'space-between',
                background: index === 0 ? 'linear-gradient(135deg, rgba(255, 215, 0, 0.15), rgba(255, 215, 0, 0.05))' : 
                            index === 1 ? 'linear-gradient(135deg, rgba(192, 192, 192, 0.15), rgba(192, 192, 192, 0.05))' : 
                            index === 2 ? 'linear-gradient(135deg, rgba(205, 127, 50, 0.15), rgba(205, 127, 50, 0.05))' : 
                            'rgba(255, 255, 255, 0.7)',
                border: index <= 2 ? `1px solid ${index===0?'rgba(255,215,0,0.3)':index===1?'rgba(192,192,192,0.3)':'rgba(205,127,50,0.3)'}` : '1px solid rgba(255,255,255,0.9)',
                boxShadow: 'var(--shadow-sm)',
                transition: 'all var(--transition-fast)',
                backdropFilter: 'blur(20px)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-secondary)', width: '30px' }}>
                  #{index + 1}
                </div>
                {index === 0 && <Medal size={24} style={{ color: 'gold' }} />}
                {index === 1 && <Medal size={24} style={{ color: 'silver' }} />}
                {index === 2 && <Medal size={24} style={{ color: '#cd7f32' }} />}
                {index > 2 && <Award size={24} style={{ color: 'var(--accent-primary)' }} />}
                
                <div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{student.name}</div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Class: {student.class || 'N/A'}</div>
                </div>
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent-primary)' }}>
                {student.points} pts
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
