"use client";
import { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
// Reusing login styles for consistency
import styles from '../login/page.module.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent! Check your inbox.");
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/user-not-found') {
        setError("Account not found. Please check your email.");
      } else if (err.code === 'auth/invalid-email') {
        setError("Invalid email address.");
      } else {
        setError("Failed to send reset email. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={`glass-panel ${styles.loginCard}`}>
        <div>
          <h1 className={`${styles.title} text-gradient`}>Reset Password</h1>
          <p className={styles.subtitle}>Enter your email to receive a reset link</p>
        </div>

        {error && <div className={styles.error}>{error}</div>}
        {message && <div style={{ color: 'var(--success)', fontSize: '0.85rem', textAlign: 'center' }}>{message}</div>}

        <form className={styles.form} onSubmit={handleResetPassword}>
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
          <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '0.5rem' }}>
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
        
        <p className={styles.switchText}>
          Remembered your password? <span className={styles.switchLink} onClick={() => router.push('/login')}>Back to Login</span>
        </p>
      </div>
    </div>
  );
}
