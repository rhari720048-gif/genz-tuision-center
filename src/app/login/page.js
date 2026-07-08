"use client";
import Link from 'next/link';
import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import toast from 'react-hot-toast';

export default function StudentLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
          toast.success('Login successful!'); router.push('/dashboard');
        } else {
          setError('Unauthorized Access'); toast.error('Unauthorized Access');
          auth.signOut();
        }
      } else {
        // Allow login anyway for testing if doc doesn't exist, or you can restrict it.
        toast.success('Login successful!'); router.push('/dashboard');
      }
    } catch (err) {
      // Firebase will throw auth/invalid-credential etc.
      // We handle these errors gracefully in the UI.
      if (err.code === 'auth/user-not-found') {
        setError('No account found with this email.'); toast.error('No account found with this email.');
      } else if (err.code === 'auth/wrong-password') {
        setError('Incorrect password.'); toast.error('Incorrect password.');
      } else if (err.code === 'auth/invalid-credential') {
        setError('Invalid credentials.'); toast.error('Invalid credentials.');
      } else {
        setError('Failed to login. Please check your network.'); toast.error('Failed to login. Please check your network.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.leftPanel}>
        <div className={styles.brandGraphic}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <img src="https://ik.imagekit.io/muthurasu/GEN%20Z/GEN_Z_LOGO__2_-removebg-preview.png.png?updatedAt=1782569180718" alt="GenZ Tuition Logo" style={{ height: '80px', filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.1))' }} />
            <h1 style={{ color: '#2563eb', fontWeight: '900', fontSize: '2.5rem', margin: 0, letterSpacing: '-0.03em' }}>GenZ Tuition</h1>
          </div>
          <p className={styles.brandSubtitle}>Welcome back. Access your premium study materials and AI-generated quizzes in one place.</p>
        </div>
      </div>
      
      <div className={styles.rightPanel}>
        <div className={styles.loginCard}>
          <div>
            <Link href="/" style={{ color: 'var(--text-secondary)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '0.9rem', fontWeight: '600' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg> Back to Home
            </Link>
            <h1 className={styles.title}>Student Portal</h1>
            <p className={styles.subtitle}>Enter your credentials to continue</p>
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
              </div>
              <div style={{ position: 'relative' }}>
                <input 
                  type={showPassword ? "text" : "password"}
                  className={styles.input} 
                  style={{ width: '100%', paddingRight: '40px' }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required 
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  )}
                </button>
              </div>
            </div>
            <button type="submit" className="btn-primary" disabled={loading} style={{marginTop: '0.5rem'}}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
          
          <p className={styles.switchText} style={{ marginTop: '1rem' }}>
            Are you an administrator? <span className={styles.switchLink} onClick={() => router.push('/admin/login')}>Admin Login</span>
          </p>
        </div>
      </div>
    </div>
  );
}
