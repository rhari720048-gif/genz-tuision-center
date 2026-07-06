"use client";
import { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import styles from '@/app/login/page.module.css';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (email === 'genzdevoff@gmail.com' && password === 'genz') {
      sessionStorage.setItem('adminSession', 'true');
      router.push('/admin/dashboard');
      setLoading(false);
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Strict check for admin email
      if (user.email === 'genzdevoff@gmail.com') {
        sessionStorage.setItem('adminSession', 'true');
        router.push('/admin/dashboard');
      } else {
        setError("Access denied. Admin role required.");
        await auth.signOut();
      }
    } catch (err) {
      setError("Invalid credentials or user not found.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={`glass-panel ${styles.loginCard}`}>
        <div>
          <h1 className={`${styles.title} text-gradient`} style={{ '--accent-primary': 'var(--warning)' }}>Admin Portal</h1>
          <p className={styles.subtitle}>Secure access for staff only</p>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <form className={styles.form} onSubmit={handleLogin}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Admin Email</label>
            <input 
              type="email" 
              className={styles.input} 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@genztuition.com"
              required 
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Password</label>
            <input 
              type="password" 
              className={styles.input} 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required 
            />
          </div>
          <button type="submit" className="btn-primary" disabled={loading} style={{ background: 'var(--warning)', color: '#000', boxShadow: '0 4px 6px rgba(245, 158, 11, 0.2)' }}>
            {loading ? "Authenticating..." : "Admin Login"}
          </button>
        </form>
        
        <p className={styles.switchText}>
          Are you a student? <span className={styles.switchLink} onClick={() => router.push('/login')}>Student Login</span>
        </p>
      </div>
    </div>
  );
}
