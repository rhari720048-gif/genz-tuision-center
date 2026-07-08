"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { BrainCircuit, Sparkles, Loader2, Save } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AIQuizGenerator() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const [topic, setTopic] = useState('');
  const [context, setContext] = useState('');
  const [count, setCount] = useState(5);
  const [targetClass, setTargetClass] = useState('10');
  
  const [generating, setGenerating] = useState(false);
  const [generatedQuiz, setGeneratedQuiz] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists() && userDoc.data().role === 'admin') {
          setIsAdmin(true);
        } else {
          router.push('/dashboard');
        }
      } else {
        router.push('/admin/login');
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!topic) return toast.error("Topic is required");

    setGenerating(true);
    setGeneratedQuiz(null);

    try {
      const res = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, context, count })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate");
      
      setGeneratedQuiz(data);
      toast.success("Quiz generated successfully!");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "An error occurred");
    } finally {
      setGenerating(false);
    }
  };

  const handleSaveToDB = async () => {
    if (!generatedQuiz) return;
    
    try {
      const quizPayload = {
        title: generatedQuiz.title,
        class: targetClass,
        questions: generatedQuiz.questions,
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, "quizzes"), quizPayload);
      toast.success("Quiz saved and published to students!");
      setGeneratedQuiz(null);
      setTopic('');
      setContext('');
    } catch (err) {
      console.error(err);
      toast.error("Failed to save quiz");
    }
  };

  if (loading) return <div style={{display:'flex',justifyContent:'center',padding:'4rem'}}>Loading...</div>;
  if (!isAdmin) return null;

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto', minHeight: '100vh' }}>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '3rem' }}>
        <h1 className="text-gradient" style={{ fontSize: '2.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <BrainCircuit size={40} /> AI Quiz Generator
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>Instantly generate multiple-choice quizzes using Gemini AI.</p>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Form Section */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass-panel" style={{ padding: '2rem', borderRadius: '12px', height: 'fit-content' }}>
          <form onSubmit={handleGenerate} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Target Class</label>
              <select value={targetClass} onChange={e => setTargetClass(e.target.value)} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.2)', color: 'white' }}>
                <option value="10">Class 10</option>
                <option value="11">Class 11</option>
                <option value="12">Class 12</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Topic / Subject</label>
              <input 
                type="text" 
                value={topic} 
                onChange={e => setTopic(e.target.value)} 
                placeholder="e.g. Thermodynamics, Algebra basics" 
                style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Number of Questions</label>
              <input 
                type="number" 
                value={count} 
                onChange={e => setCount(parseInt(e.target.value))} 
                min="1" max="20"
                style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Study Material Context (Optional)</label>
              <textarea 
                value={context} 
                onChange={e => setContext(e.target.value)} 
                placeholder="Paste notes or text here to generate questions based strictly on this content..." 
                rows="5"
                style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.2)', color: 'white', resize: 'vertical' }}
              />
            </div>

            <button type="submit" className="btn-primary" disabled={generating} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
              {generating ? <Loader2 className="spin" size={20} /> : <Sparkles size={20} />}
              {generating ? 'Generating...' : 'Generate with AI'}
            </button>
          </form>
        </motion.div>

        {/* Preview Section */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-panel" style={{ padding: '2rem', borderRadius: '12px' }}>
          <h2 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>Preview</h2>
          
          {!generatedQuiz && !generating && (
            <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '3rem 0' }}>
              <BrainCircuit size={64} style={{ opacity: 0.2, margin: '0 auto 1rem auto' }} />
              <p>Generated quiz will appear here.</p>
            </div>
          )}

          {generating && (
            <div style={{ textAlign: 'center', color: 'var(--accent-primary)', padding: '3rem 0' }}>
              <Loader2 size={48} className="spin" style={{ margin: '0 auto 1rem auto' }} />
              <p>AI is thinking...</p>
            </div>
          )}

          {generatedQuiz && (
            <div>
              <h3 style={{ color: 'var(--accent-primary)', marginBottom: '1.5rem' }}>{generatedQuiz.title}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxHeight: '500px', overflowY: 'auto', paddingRight: '1rem' }}>
                {generatedQuiz.questions.map((q, idx) => (
                  <div key={idx} style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px' }}>
                    <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>{idx + 1}. {q.question}</p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                      <div>A: {q.options.A}</div>
                      <div>B: {q.options.B}</div>
                      <div>C: {q.options.C}</div>
                      <div>D: {q.options.D}</div>
                    </div>
                    <p style={{ marginTop: '0.5rem', color: 'var(--success)', fontWeight: 'bold', fontSize: '0.9rem' }}>
                      Correct Answer: {q.correct}
                    </p>
                  </div>
                ))}
              </div>

              <button onClick={handleSaveToDB} className="btn-secondary" style={{ width: '100%', marginTop: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', background: 'var(--success)', color: 'white', border: 'none' }}>
                <Save size={20} /> Publish to Students
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
