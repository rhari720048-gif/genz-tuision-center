"use client";
import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { motion } from 'framer-motion';
import { Calendar, Trash2, CheckCircle, Plus } from 'lucide-react';
import CalendarReact from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import styles from './page.module.css'; // We'll create custom css overrides

export default function PlannerPage() {
  const [userData, setUserData] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [date, setDate] = useState(new Date());
  const [newTask, setNewTask] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserData({ id: user.uid });
        fetchTasks(user.uid);
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchTasks = async (uid) => {
    try {
      const q = query(collection(db, "planner_tasks"), where("studentId", "==", uid));
      const snap = await getDocs(q);
      const list = [];
      snap.forEach(d => list.push({ id: d.id, ...d.data() }));
      setTasks(list);
    } catch(err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    try {
      const taskDate = date.toISOString().split('T')[0];
      const taskDoc = await addDoc(collection(db, "planner_tasks"), {
        studentId: userData.id,
        title: newTask,
        date: taskDate,
        completed: false
      });
      setTasks([...tasks, { id: taskDoc.id, studentId: userData.id, title: newTask, date: taskDate, completed: false }]);
      setNewTask("");
    } catch(err) {
      console.error("Failed to add task", err);
    }
  };

  const toggleComplete = async (id, currentStatus) => {
    try {
      await updateDoc(doc(db, "planner_tasks", id), { completed: !currentStatus });
      setTasks(tasks.map(t => t.id === id ? { ...t, completed: !currentStatus } : t));
    } catch(err) {
      console.error("Failed to update task", err);
    }
  };

  const deleteTask = async (id) => {
    if(!confirm("Delete this task?")) return;
    try {
      await deleteDoc(doc(db, "planner_tasks", id));
      setTasks(tasks.filter(t => t.id !== id));
    } catch(err) {
      console.error("Failed to delete task", err);
    }
  };

  const selectedDateStr = date.toISOString().split('T')[0];
  const todaysTasks = tasks.filter(t => t.date === selectedDateStr);

  if (loading) return <div style={{display:'flex',justifyContent:'center',padding:'4rem'}}>Loading Planner...</div>;

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto', minHeight: '100vh' }}>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '3rem' }}>
        <h1 className="text-gradient" style={{ fontSize: '3rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Calendar size={48} /> Study Planner
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>Plan your study sessions and stay on track.</p>
      </motion.div>

      <div className={styles.plannerLayout}>
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className={styles.calendarSection}>
          <div className={styles.plannerCard}>
             <CalendarReact 
               onChange={setDate} 
               value={date} 
               className={styles.customCalendar}
             />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className={styles.tasksSection}>
          <div className={styles.plannerCard} style={{ minHeight: '400px' }}>
            <h2 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
              Tasks for {date.toDateString()}
            </h2>

            <form onSubmit={handleAddTask} style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
              <input 
                type="text" 
                value={newTask} 
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="What to study today?"
                style={{ flex: 1, padding: '1rem 1.25rem', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)', background: '#ffffff', color: 'var(--text-primary)', boxShadow: 'var(--shadow-sm)', fontSize: '0.95rem' }}
              />
              <button type="submit" className="btn-primary" style={{ padding: '0 1.5rem', borderRadius: '12px' }}>
                <Plus size={20} />
              </button>
            </form>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {todaysTasks.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginTop: '2rem' }}>No tasks scheduled for this day.</p>
              ) : (
                todaysTasks.map(task => (
                  <div key={task.id} className={`${styles.taskCard} ${task.completed ? styles.taskCardCompleted : ''}`} style={{ borderLeft: task.completed ? '4px solid var(--success)' : '4px solid var(--accent-primary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', textDecoration: task.completed ? 'line-through' : 'none' }}>
                      <button onClick={() => toggleComplete(task.id, task.completed)} style={{ background: 'none', border: 'none', color: task.completed ? 'var(--success)' : 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0 }}>
                        <CheckCircle size={24} />
                      </button>
                      <span style={{ fontSize: '1.05rem', fontWeight: 500, color: task.completed ? 'var(--text-secondary)' : 'var(--text-primary)' }}>{task.title}</span>
                    </div>
                    <button onClick={() => deleteTask(task.id)} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '0.5rem', display: 'flex', alignItems: 'center', borderRadius: '8px', transition: 'all 0.2s' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'} onMouseOut={e => e.currentTarget.style.background = 'none'}>
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
