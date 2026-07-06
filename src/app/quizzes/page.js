"use client";
import { useEffect, useState } from 'react';
import { collection, getDocs, query, where, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export default function QuizzesPage() {
  const [quizzes, setQuizzes] = useState([]);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Quiz Engine States
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // { questionIndex: 'A' }
  const [quizFinished, setQuizFinished] = useState(false);
  const [scoreResult, setScoreResult] = useState({ score: 0, max: 0 });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const uData = { id: user.uid, ...userDoc.data() };
          setUserData(uData);
          fetchQuizzes(uData.class);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchQuizzes = async (studentClass) => {
    try {
      const q = query(collection(db, "quizzes"), where("class", "==", studentClass));
      const snap = await getDocs(q);
      const list = [];
      snap.forEach(d => list.push({ id: d.id, ...d.data() }));
      setQuizzes(list);
      setLoading(false);
    } catch(err) {
      console.error(err);
      setLoading(false);
    }
  };

  const startQuiz = (quiz) => {
    if (!quiz.questions || quiz.questions.length === 0) {
      return alert("This quiz has no questions yet!");
    }
    setActiveQuiz(quiz);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setQuizFinished(false);
  };

  const handleOptionSelect = (optionKey) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestionIndex]: optionKey
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < activeQuiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handleSubmitQuiz = async () => {
    if (!confirm("Are you sure you want to submit your answers?")) return;
    
    // Auto-Grade
    let correctCount = 0;
    activeQuiz.questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correct) {
        correctCount++;
      }
    });

    const maxScore = activeQuiz.questions.length * 10; // 10 marks per question
    const achievedScore = correctCount * 10;

    setScoreResult({ score: achievedScore, max: maxScore, correct: correctCount, total: activeQuiz.questions.length });
    setQuizFinished(true);

    // Save to Database automatically
    try {
      await addDoc(collection(db, "marks"), {
        studentId: userData.id,
        subject: `Quiz: ${activeQuiz.title}`,
        score: achievedScore,
        max: maxScore,
        date: serverTimestamp()
      });
    } catch(err) {
      console.error("Failed to save score", err);
    }
  };

  if (loading) return <div style={{display:'flex',justifyContent:'center',padding:'4rem'}}>Loading Quizzes...</div>;

  // RESULTS VIEW
  if (quizFinished && activeQuiz) {
    return (
      <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', minHeight: '100vh', textAlign: 'center' }}>
        <div className="glass-panel" style={{ padding: '3rem', borderRadius: '12px', marginTop: '2rem' }}>
          <h1 className="text-gradient" style={{ fontSize: '3rem', marginBottom: '1rem' }}>Quiz Completed!</h1>
          <h2 style={{ color: 'var(--text-primary)', marginBottom: '2rem' }}>{activeQuiz.title}</h2>
          
          <div style={{ fontSize: '5rem', fontWeight: 'bold', color: 'var(--accent-primary)', marginBottom: '1rem' }}>
            {scoreResult.score} <span style={{fontSize: '2rem', color: 'var(--text-secondary)'}}>/ {scoreResult.max}</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.25rem', marginBottom: '3rem' }}>
            You answered {scoreResult.correct} out of {scoreResult.total} questions correctly!
          </p>
          
          <p style={{ color: 'var(--success)', fontWeight: 'bold', marginBottom: '2rem' }}>
            ✅ Your score has been automatically recorded to your Performance History.
          </p>

          <button className="btn-primary" onClick={() => setActiveQuiz(null)}>Back to Quizzes</button>
        </div>
      </div>
    );
  }

  // QUIZ TAKING VIEW
  if (activeQuiz) {
    const currentQ = activeQuiz.questions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === activeQuiz.questions.length - 1;

    return (
      <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', minHeight: '100vh' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2 style={{ color: 'var(--text-primary)' }}>{activeQuiz.title}</h2>
          <div style={{ background: 'var(--accent-primary)', color: 'white', padding: '0.5rem 1rem', borderRadius: '20px', fontWeight: 'bold' }}>
            Question {currentQuestionIndex + 1} of {activeQuiz.questions.length}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '2rem', borderRadius: '12px' }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '2rem', color: 'var(--text-primary)', lineHeight: '1.5' }}>
            {currentQ.question}
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
            {Object.entries(currentQ.options).map(([key, value]) => (
              <button 
                key={key}
                onClick={() => handleOptionSelect(key)}
                style={{
                  padding: '1.5rem', textAlign: 'left', borderRadius: '8px', fontSize: '1.1rem',
                  border: selectedAnswers[currentQuestionIndex] === key ? '2px solid var(--accent-secondary)' : '2px solid rgba(0,0,0,0.1)',
                  background: selectedAnswers[currentQuestionIndex] === key ? 'rgba(6, 214, 160, 0.1)' : 'transparent',
                  color: 'var(--text-primary)', cursor: 'pointer', transition: 'all 0.2s'
                }}
              >
                <span style={{ fontWeight: 'bold', marginRight: '1rem', color: 'var(--accent-primary)' }}>{key})</span> {value}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button 
              onClick={() => setActiveQuiz(null)} 
              style={{ padding: '1rem 2rem', background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontWeight: 'bold' }}
            >
              Quit Quiz
            </button>
            
            {isLastQuestion ? (
              <button 
                className="btn-primary" 
                onClick={handleSubmitQuiz}
                disabled={!selectedAnswers[currentQuestionIndex]}
                style={{ opacity: !selectedAnswers[currentQuestionIndex] ? 0.5 : 1 }}
              >
                Submit & Grade
              </button>
            ) : (
              <button 
                className="btn-primary" 
                onClick={handleNext}
                disabled={!selectedAnswers[currentQuestionIndex]}
                style={{ opacity: !selectedAnswers[currentQuestionIndex] ? 0.5 : 1 }}
              >
                Next Question ➔
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // QUIZ LIST VIEW
  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', minHeight: '100vh' }}>
      <h1 className="text-gradient" style={{ fontSize: '3rem', marginBottom: '1rem' }}>Quiz Section</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '3rem' }}>Challenge yourself with daily and chapter-wise quizzes. Scores are automatically recorded.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
        {quizzes.length === 0 ? <p>No active quizzes available for Class {userData?.class}.</p> : quizzes.map((q, i) => (
          <div key={i} className="glass-panel" style={{ padding: '2rem', borderRadius: '12px' }}>
            <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)', fontSize: '1.5rem' }}>{q.title}</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              📝 {q.questions?.length || 0} Questions
            </p>
            <button className="btn-primary" onClick={() => startQuiz(q)}>Start Quiz</button>
          </div>
        ))}
      </div>
    </div>
  );
}
