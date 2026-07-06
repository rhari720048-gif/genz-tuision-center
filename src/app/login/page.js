"use client";
import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function StudentLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Verify role in Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.role === 'student' || userData.role === 'admin') {
          router.push('/dashboard');
        } else {
          setError("Access denied. Invalid role.");
          auth.signOut();
        }
      } else {
        // Allow login anyway for testing if doc doesn't exist, or you can restrict it.
        router.push('/dashboard');
      }
    } catch (err) {
      // Firebase will throw auth/invalid-credential etc.
      // We handle these errors gracefully in the UI.
      if (err.code === 'auth/user-not-found') {
        setError("Account not found. Please create an account first.");
      } else if (err.code === 'auth/wrong-password') {
        setError("Incorrect password. Please try again.");
      } else if (err.code === 'auth/invalid-credential') {
        setError("Invalid email or password. If you don't have an account, please register first.");
      } else {
        setError("Failed to login. Please check your credentials.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={`glass-panel ${styles.loginCard}`}>
        <div>
          <h1 className={`${styles.title} text-gradient`}>Student Login</h1>
          <p className={styles.subtitle}>Enter your portal credentials</p>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <form className={styles.form} onSubmit={handleLogin}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Email Address</label>
            <input 
              type="email" 
              className={styles.input} 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="student@example.com"
              required 
            />
          </div>
          <div className={styles.inputGroup}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className={styles.label}>Password</label>
              <span className={styles.switchLink} style={{ fontSize: '0.8rem', fontWeight: 500 }} onClick={() => router.push('/forgot-password')}>Forgot Password?</span>
            </div>
            <input 
              type="password" 
              className={styles.input} 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required 
            />
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        
        <p className={styles.switchText}>
          Forgot your password? <span className={styles.switchLink} onClick={() => router.push('/forgot-password')}>Reset Here</span>
        </p>
        <p className={styles.switchText} style={{ marginTop: '0.5rem' }}>
          Are you an administrator? <span className={styles.switchLink} onClick={() => router.push('/admin/login')}>Admin Login</span>
        </p>
      </div>
    </div>
  );
}
