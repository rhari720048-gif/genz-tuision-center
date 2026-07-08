"use client";
import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, serverTimestamp, deleteDoc, doc, updateDoc, writeBatch, setDoc, query, limit, where } from 'firebase/firestore';
import { db, auth, firebaseConfig } from '@/lib/firebase';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signOut as secondarySignOut, onAuthStateChanged, signOut, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Users, ClipboardList, Banknote, BookOpen, FileQuestion, Bell, LogOut, Search, UserCircle, PlusCircle, FileUp, Download, Menu, X, CheckCircle2, BrainCircuit, Printer, Bot, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './page.module.css';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [students, setStudents] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [fees, setFees] = useState([]);
  
  // Search queries
  const [searchSt, setSearchSt] = useState('');
  const [searchMat, setSearchMat] = useState('');
  const [searchQuiz, setSearchQuiz] = useState('');
  const [searchNotif, setSearchNotif] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();

  const sendEmailNotification = async (to, subject, html) => {
    try {
      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to, subject, html })
      });
    } catch (error) {
      console.error("Email sending failed:", error);
    }
  };

  // Load Data & Auth Guard
  useEffect(() => {
    const adminSession = sessionStorage.getItem('adminSession');
    if (adminSession === 'true') {
      fetchData();
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user || user.email !== 'genzdevoff@gmail.com') {
        router.push('/admin/login');
      } else {
        sessionStorage.setItem('adminSession', 'true');
        fetchData();
      }
    });
    return () => unsubscribe?.();
  }, [router]);

  const fetchData = async () => {
    fetchStudents();
    fetchMaterials();
    fetchQuizzes();
    fetchNotifications();
    fetchFees();
  };

  const fetchStudents = async () => {
    const q = query(collection(db, "users"), limit(100));
    const snapshot = await getDocs(q);
    const list = [];
    snapshot.forEach(d => { if(d.data().role === 'student') list.push({ id: d.id, ...d.data() }); });
    setStudents(list);
  };
  const fetchMaterials = async () => {
    const q = await getDocs(collection(db, "materials"));
    const list = [];
    q.forEach(d => list.push({ id: d.id, ...d.data() }));
    setMaterials(list);
  };
  const fetchQuizzes = async () => {
    const q = await getDocs(collection(db, "quizzes"));
    const list = [];
    q.forEach(d => list.push({ id: d.id, ...d.data() }));
    setQuizzes(list);
  };
  const fetchNotifications = async () => {
    const q = await getDocs(collection(db, "notifications"));
    const list = [];
    q.forEach(d => list.push({ id: d.id, ...d.data() }));
    setNotifications(list);
  };
  const fetchFees = async () => {
    const q = await getDocs(collection(db, "fees"));
    const list = [];
    q.forEach(d => list.push({ id: d.id, ...d.data() }));
    setFees(list);
  };

  // Student Form states
  const [stName, setStName] = useState('');
  const [stEmail, setStEmail] = useState('');
  const [stPassword, setStPassword] = useState('');
  const [showStPassword, setShowStPassword] = useState(false);
  const [stClass, setStClass] = useState('10');
  const [stDept, setStDept] = useState('Maths - Biology');
  const [stSubjects, setStSubjects] = useState('Tamil, English, Maths, Science, Social Science');
  const [editSt, setEditSt] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [bulkCsv, setBulkCsv] = useState(null);
  const [isUploadingCsv, setIsUploadingCsv] = useState(false);
  
  // Batch Attendance States
  const [attBatchClass, setAttBatchClass] = useState('10');
  const [attBatchDate, setAttBatchDate] = useState(new Date().toISOString().split('T')[0]);
  const [attBatchStatus, setAttBatchStatus] = useState({});

  // Bulk Marks States
  const [markBatchClass, setMarkBatchClass] = useState('10');
  const [markBatchSubject, setMarkBatchSubject] = useState('');
  const [markBatchMax, setMarkBatchMax] = useState('100');
  const [markBatchScores, setMarkBatchScores] = useState({});

  // Materials & Quizzes
  const [matTitle, setMatTitle] = useState('');
  const [matUrl, setMatUrl] = useState('');
  const [matClass, setMatClass] = useState('All');
  const [matDept, setMatDept] = useState('All');
  const [matSubject, setMatSubject] = useState('Science');
  const [matType, setMatType] = useState('Notes');
  const [editMat, setEditMat] = useState(null);

  const [quizTitle, setQuizTitle] = useState('');
  const [quizClass, setQuizClass] = useState('10');
  const [quizDept, setQuizDept] = useState('All');
  const [quizTime, setQuizTime] = useState('30');
  const [editQuiz, setEditQuiz] = useState(null);
  const [quizGenMode, setQuizGenMode] = useState('manual');
  const [quizGenTopic, setQuizGenTopic] = useState('');
  const [quizGenNumQ, setQuizGenNumQ] = useState(5);
  const [isGenerating, setIsGenerating] = useState(false);
  const [autoGenMatQuiz, setAutoGenMatQuiz] = useState(false);

  const [notifTitle, setNotifTitle] = useState('');
  const [notifMsg, setNotifMsg] = useState('');
  const [notifClass, setNotifClass] = useState('All');
  const [notifDept, setNotifDept] = useState('All');
  const [editNotif, setEditNotif] = useState(null);

  // Fees States
  const [feeStudentId, setFeeStudentId] = useState('');
  const [feeMonth, setFeeMonth] = useState('January');
  const [feeStatus, setFeeStatus] = useState('Pending');
  const [feeAmount, setFeeAmount] = useState('1000');
  const [feeDueDate, setFeeDueDate] = useState('');
  const [bulkFeeClass, setBulkFeeClass] = useState('All');

  // Student Profile States
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentMarks, setStudentMarks] = useState([]);
  const [studentAttendance, setStudentAttendance] = useState([]);
  const [studentFees, setStudentFees] = useState([]);

  // Quiz Builder States
  const [activeQuizForQuestions, setActiveQuizForQuestions] = useState(null);
  const [qText, setQText] = useState('');
  const [qOptA, setQOptA] = useState('');
  const [qOptB, setQOptB] = useState('');
  const [qOptC, setQOptC] = useState('');
  const [qOptD, setQOptD] = useState('');
  const [qCorrect, setQCorrect] = useState('A');

  // CSV Parser helper
  const handleCsvUpload = async (e) => {
    e.preventDefault();
    if (!bulkCsv) return toast.error("Please select a CSV file.");
    setIsUploadingCsv(true);

    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target.result;
      const rows = text.split('\n').map(row => row.split(',').map(cell => cell.trim()));
      
      // Skip header, process rows
      let successCount = 0;
      let errorCount = 0;

      const secondaryApp = getApps().find(a => a.name === "Secondary") || initializeApp(firebaseConfig, "Secondary");
      const secondaryAuth = getAuth(secondaryApp);

      for (let i = 1; i < rows.length; i++) {
        const [name, email, password, sClass, dept] = rows[i];
        if (!email || !password) continue;
        
        try {
          const cred = await createUserWithEmailAndPassword(secondaryAuth, email, password);
          await setDoc(doc(db, "users", cred.user.uid), { 
            name, email, class: sClass, department: dept, role: 'student', createdAt: serverTimestamp() 
          });
          await secondarySignOut(secondaryAuth);
          
          // Send Email
          await sendEmailNotification(
            email, 
            "Welcome to GenZ Tuition Center!", 
            `<h3>Hello ${name},</h3><p>Your student account has been created successfully.</p><p><b>Login Email:</b> ${email}<br/><b>Password:</b> ${password}</p><p>Please login to your portal to see your dashboard.</p>`
          );

          successCount++;
        } catch (err) {
          console.error(`Row ${i} failed:`, err);
          errorCount++;
        }
      }
      
      toast.error(`Bulk Upload Complete.\nSuccess: ${successCount}\nFailed: ${errorCount}`);
      setBulkCsv(null);
      setIsUploadingCsv(false);
      fetchStudents();
    };
    reader.readAsText(bulkCsv);
  };

  const downloadSampleCsv = () => {
    const csvContent = "data:text/csv;charset=utf-8,Name,Email,Password,Class,Department\nJohn Doe,john@test.com,password123,10,Science\nJane Smith,jane@test.com,password123,12,Commerce";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "student_sample.csv");
    document.body.appendChild(link);
    link.click();
  };

  // Handlers
  const handleStudent = async (e) => {
    e.preventDefault();
    if(isRegistering) return;
    
    if (editSt) {
      setIsRegistering(true);
      try {
        await updateDoc(doc(db, "users", editSt.id), { name: stName, email: stEmail, class: stClass, department: stClass === '10' ? 'General' : stDept, subjects: stSubjects });
        setEditSt(null);
        toast.success("Student Updated");
      } catch (err) {
        console.error("Error updating student:", err);
        toast.error("Error updating student: " + err.message);
      } finally {
        setIsRegistering(false);
      }
    } else {
      if(stPassword.length < 6) return toast.success("Password must be at least 6 characters.");
      setIsRegistering(true);
      try {
        const secondaryApp = getApps().find(a => a.name === "Secondary") || initializeApp(firebaseConfig, "Secondary");
        const secondaryAuth = getAuth(secondaryApp);
        
        const cred = await createUserWithEmailAndPassword(secondaryAuth, stEmail, stPassword);
        const uid = cred.user.uid;
        await secondarySignOut(secondaryAuth);
        
        await setDoc(doc(db, "users", uid), { name: stName, email: stEmail, class: stClass, department: stClass === '10' ? 'General' : stDept, subjects: stSubjects, role: 'student', createdAt: serverTimestamp() });
        
        // Send Email
        await sendEmailNotification(
          stEmail, 
          "Welcome to GenZ Tuition Center!", 
          `<h3>Hello ${stName},</h3><p>Your student account has been created successfully.</p><p><b>Login Email:</b> ${stEmail}<br/><b>Password:</b> ${stPassword}</p><p>Please login to your portal to see your dashboard.</p>`
        );

        toast.success("Student Securely Created & Welcome Email Sent!");
      } catch (err) {
        if (err.code === 'auth/email-already-in-use') {
          try {
            const secondaryApp = getApps().find(a => a.name === "Secondary") || initializeApp(firebaseConfig, "Secondary");
            const secondaryAuth = getAuth(secondaryApp);
            const loginCred = await signInWithEmailAndPassword(secondaryAuth, stEmail, stPassword);
            const uid = loginCred.user.uid;
            await secondarySignOut(secondaryAuth);
            
            await setDoc(doc(db, "users", uid), { name: stName, email: stEmail, class: stClass, department: stDept, role: 'student', createdAt: serverTimestamp() });
            
            await sendEmailNotification(
              stEmail, 
              "Account Restored - GenZ Tuition Center!", 
              `<h3>Hello ${stName},</h3><p>Your student account has been restored successfully.</p><p><b>Login Email:</b> ${stEmail}<br/><b>Password:</b> ${stPassword}</p>`
            );
            toast.success("This student was previously deleted from the database but remained in Authentication. We have RESTORED their database record successfully!");
          } catch(recoverErr) {
            return toast.error("Error: This email is already registered in Firebase Authentication, but the password provided is incorrect, so we could not restore it. To completely remove it, please go to Firebase Console -> Authentication -> Users and delete this email manually.");
          }
        } else if (err.code === 'auth/invalid-email') {
          return toast.error("Error: Invalid email format.");
        } else if (err.code === 'auth/weak-password') {
          return toast.error("Error: Password is too weak. Please use at least 6 characters.");
        } else {
          console.error(err);
          return toast.error(err.message);
        }
      } finally {
        setIsRegistering(false);
      }
    }
    setStName(''); setStEmail(''); setStPassword(''); fetchStudents();
  };

  const handleBatchAttendance = async (e) => {
    e.preventDefault();
    const targetStudents = students.filter(s => s.class === attBatchClass);
    if (targetStudents.length === 0) return toast.success("No students in this class!");
    if (!attBatchDate) return toast.error("Please select a date!");
    
    try {
      const batch = writeBatch(db);
      targetStudents.forEach(st => {
        const isPresent = attBatchStatus[st.id] !== false; // Default true if undefined
        const attRef = doc(collection(db, "attendance"));
        batch.set(attRef, { studentId: st.id, date: attBatchDate, status: isPresent ? 'Present' : 'Absent' });
      });
      await batch.commit();
      toast.success("Batch Attendance Saved for Class " + attBatchClass);
      setAttBatchStatus({});
    } catch(err) {
      toast.error("Error saving attendance");
    }
  };

  const handleBulkMarks = async (e) => {
    e.preventDefault();
    const targetStudents = students.filter(s => s.class === markBatchClass);
    if (targetStudents.length === 0) return toast.success("No students in this class!");
    if (!markBatchSubject) return toast.error("Please enter a subject!");
    
    try {
      const batch = writeBatch(db);
      targetStudents.forEach(st => {
        const score = markBatchScores[st.id];
        if (score !== undefined && score !== '') {
          const markRef = doc(collection(db, "marks"));
          batch.set(markRef, { studentId: st.id, subject: markBatchSubject, score: Number(score), max: Number(markBatchMax), date: serverTimestamp() });
        }
      });
      await batch.commit();
      toast.success("Bulk Marks Saved for Class " + markBatchClass);
      setMarkBatchScores({});
    } catch(err) {
      toast.error("Error saving marks");
    }
  };



  const generateQuizFromTopic = async (topic, numQ, qClass, qDept, qTime) => {
    setIsGenerating(true);
    const loadingToast = toast.loading(`Generating AI Quiz for ${topic}...`);
    try {
      const res = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, context: '', count: numQ })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Generation failed');
      
      const newQuizId = await addDoc(collection(db, "quizzes"), {
        title: `AI Quiz: ${topic}`,
        class: qClass,
        department: qClass === '10' ? 'General' : qDept,
        timePerQ: Number(qTime),
        createdAt: serverTimestamp(),
        questions: data.questions || []
      });
      
      await addDoc(collection(db, "notifications"), { title: `New AI Quiz: ${topic}`, message: `A new AI-generated quiz has been added for Class ${qClass}.`, targetClass: qClass, targetDepartment: qClass === '10' ? 'General' : qDept, createdAt: serverTimestamp() });
      toast.success("AI Quiz Generated Successfully!", { id: loadingToast });
      fetchQuizzes();
      fetchNotifications();
      return true;
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate AI Quiz: " + err.message, { id: loadingToast });
      return false;
    } finally {
      setIsGenerating(false);
    }
  };

  const handleMaterial = async (e) => {
    e.preventDefault();
    if (editMat) {
      await updateDoc(doc(db, "materials", editMat.id), { title: matTitle, fileUrl: matUrl, class: matClass, department: matClass === '10' ? 'General' : matDept, subject: matSubject, type: matType });
      setEditMat(null);
      toast.success("Material Updated");
    } else {
      await addDoc(collection(db, "materials"), { title: matTitle, fileUrl: matUrl, class: matClass, department: matClass === '10' ? 'General' : matDept, subject: matSubject, type: matType, uploadedAt: serverTimestamp() });
      await addDoc(collection(db, "notifications"), { title: `New Material: ${matTitle}`, message: `A new ${matType} for ${matSubject} has been uploaded.`, targetClass: matClass, targetDepartment: matClass === '10' ? 'General' : matDept, createdAt: serverTimestamp() });
      
      if (autoGenMatQuiz) {
         await generateQuizFromTopic(matTitle, 5, matClass, matClass === '10' ? 'General' : matDept, 30);
      }

      // Send Email to targeted students
      let targetStudents = students;
      if (matClass && matClass !== 'All') {
        targetStudents = targetStudents.filter(s => s.class === matClass);
      }
      if (matDept && matDept !== 'All' && matClass !== '10') {
        targetStudents = targetStudents.filter(s => s.department === matDept || s.department === 'General');
      }
      if (matSubject && matSubject !== 'All') {
        targetStudents = targetStudents.filter(s => {
          if (!s.subjects) return false;
          return s.subjects.toLowerCase().includes(matSubject.trim().toLowerCase());
        });
      }
      
      targetStudents.forEach(st => {
        sendEmailNotification(
          st.email,
          `New Study Material: ${matTitle}`,
          `<h3>Hello ${st.name},</h3><p>A new ${matType} for ${matSubject} has been uploaded to your portal.</p><p>Please login to review it.</p>`
        );
      });

      toast.success("Material Uploaded & Notification Auto-Sent!");
    }
    setMatTitle(''); setMatUrl(''); setAutoGenMatQuiz(false); fetchMaterials(); fetchNotifications();
  };

  const handleAIQuizSubmit = async (e) => {
    e.preventDefault();
    if(!quizGenTopic) return toast.error("Please enter a topic");
    await generateQuizFromTopic(quizGenTopic, quizGenNumQ, quizClass, quizClass === '10' ? 'General' : quizDept, quizTime);
    setQuizGenTopic('');
  };

  const handleQuiz = async (e) => {
    e.preventDefault();
    if (editQuiz) {
      await updateDoc(doc(db, "quizzes", editQuiz.id), { title: quizTitle, class: quizClass, department: quizClass === '10' ? 'General' : quizDept, timePerQ: Number(quizTime) });
      setEditQuiz(null);
      toast.success("Quiz Updated");
    } else {
      await addDoc(collection(db, "quizzes"), { title: quizTitle, class: quizClass, department: quizClass === '10' ? 'General' : quizDept, timePerQ: Number(quizTime), createdAt: serverTimestamp(), questions: [] });
      await addDoc(collection(db, "notifications"), { title: `New Quiz: ${quizTitle}`, message: `A new quiz has been created for Class ${quizClass}. Check your portal!`, targetClass: quizClass, targetDepartment: quizClass === '10' ? 'General' : quizDept, createdAt: serverTimestamp() });
      toast.success("Quiz Created & Notification Auto-Sent!");
    }
    setQuizTitle(''); fetchQuizzes(); fetchNotifications();
  };

  const handleNotification = async (e) => {
    e.preventDefault();
    if (editNotif) {
      await updateDoc(doc(db, "notifications", editNotif.id), { title: notifTitle, message: notifMsg, targetClass: notifClass, targetDepartment: notifClass === '10' ? 'General' : notifDept });
      setEditNotif(null);
      toast.success("Notification Updated");
    } else {
      await addDoc(collection(db, "notifications"), { title: notifTitle, message: notifMsg, targetClass: notifClass, targetDepartment: notifClass === '10' ? 'General' : notifDept, createdAt: serverTimestamp() });
      
      // Send Broadcast Email to TARGETED students
      let targetStudents = students;
      if (notifClass !== 'All') targetStudents = targetStudents.filter(s => String(s.class) === String(notifClass));
      if (notifDept !== 'All' && notifClass !== '10') targetStudents = targetStudents.filter(s => s.department === 'General' || s.department === notifDept);

      targetStudents.forEach(st => {
        sendEmailNotification(
          st.email,
          `GenZ Alert: ${notifTitle}`,
          `<h3>Hello ${st.name},</h3><p>You have a new targeted notification from the GenZ Admin:</p><blockquote style="border-left: 4px solid #06D6A0; padding-left: 10px;">${notifMsg}</blockquote>`
        );
      });

      toast.success(`Notification Sent & Emailed to ${targetStudents.length} Students!`);
    }
    setNotifTitle(''); setNotifMsg(''); setNotifClass('All'); setNotifDept('All'); fetchNotifications();
  };

  const handleFeeUpdate = async (e) => {
    e.preventDefault();
    if(!feeStudentId) return toast.success("Select a student");
    try {
      await addDoc(collection(db, "fees"), { 
        studentId: feeStudentId, 
        month: feeMonth, 
        status: feeStatus, 
        amount: Number(feeAmount), 
        dueDate: feeDueDate,
        updatedAt: serverTimestamp() 
      });

      // Send Email for Fee update
      const student = students.find(s => s.id === feeStudentId);
      if (student) {
        sendEmailNotification(
          student.email,
          `Fee Update: ${feeMonth}`,
          `<h3>Hello ${student.name},</h3><p>Your fee status for <b>${feeMonth}</b> has been updated.</p><p><b>Status:</b> ${feeStatus}<br/><b>Amount:</b> ₹${feeAmount}<br/><b>Due Date:</b> ${feeDueDate}</p>`
        );
      }

      toast.success("Fee Status Updated & Email Sent!");
      fetchFees();
    } catch(err) {
      console.error(err);
      toast.error("Failed to update fees");
    }
  };

  const handleBulkFees = async (e) => {
    e.preventDefault();
    const targetStudents = bulkFeeClass === 'All' ? students : students.filter(s => s.class === bulkFeeClass);
    if (targetStudents.length === 0) return toast.success("No students found.");
    if (!confirm(`Generate pending fees for ${targetStudents.length} students for ${feeMonth}?`)) return;
    
    try {
      const batch = writeBatch(db);
      targetStudents.forEach(st => {
        const feeRef = doc(collection(db, "fees"));
        batch.set(feeRef, { studentId: st.id, month: feeMonth, status: 'Pending', amount: Number(feeAmount), dueDate: feeDueDate, updatedAt: serverTimestamp() });
      });
      await batch.commit();
      toast.success(`Successfully generated fees for ${targetStudents.length} students!`);
      fetchFees();
    } catch(err) {
      console.error(err);
      toast.error("Error generating bulk fees.");
    }
  };

  const handleSendFeeReminders = async () => {
    const pendingFees = fees.filter(f => f.status === 'Pending');
    if (pendingFees.length === 0) return toast.success("No pending fees found!");
    if (!confirm(`Send reminders to ${pendingFees.length} students with pending fees?`)) return;
    
    try {
      const batch = writeBatch(db);
      let count = 0;
      pendingFees.forEach(fee => {
        const student = students.find(s => s.id === fee.studentId);
        if (student) {
          const notifRef = doc(collection(db, "notifications"));
          batch.set(notifRef, {
            title: `URGENT: Fee Reminder - ${fee.month}`,
            message: `Dear ${student.name}, your fee of ₹${fee.amount} for ${fee.month} is pending. Please pay by ${fee.dueDate}.`,
            targetStudentId: student.id,
            createdAt: serverTimestamp()
          });
          count++;
        }
      });
      await batch.commit();
      toast.success(`Sent ${count} fee reminders successfully!`);
      fetchNotifications();
    } catch(err) {
      console.error(err);
      toast.error("Error sending reminders.");
    }
  };

  const handleScanAttendance = async () => {
    if (!confirm("Scan all students for low attendance (<75%) and send warnings?")) return;
    try {
      const batch = writeBatch(db);
      let count = 0;
      
      const attQ = query(collection(db, "attendance"));
      const aSnap = await getDocs(attQ);
      const allAtt = [];
      aSnap.forEach(d => allAtt.push({id: d.id, ...d.data()}));
      
      for (const st of students) {
        const stAtt = allAtt.filter(a => a.studentId === st.id);
        if (stAtt.length >= 5) { // Only check if they have at least 5 days of records
          const present = stAtt.filter(a => a.status === 'Present').length;
          const pct = Math.round((present / stAtt.length) * 100);
          if (pct < 75) {
            const notifRef = doc(collection(db, "notifications"));
            batch.set(notifRef, {
              title: `Warning: Low Attendance Alert`,
              message: `Dear ${st.name}, your current attendance is very low (${pct}%). Please maintain at least 75% attendance.`,
              targetStudentId: st.id,
              createdAt: serverTimestamp()
            });
            count++;
          }
        }
      }
      
      if (count > 0) {
        await batch.commit();
        toast.success(`Sent low attendance warnings to ${count} students.`);
        fetchNotifications();
      } else {
        toast.success("All students have satisfactory attendance (>=75%).");
      }
    } catch(err) {
      console.error(err);
      toast.error("Error scanning attendance.");
    }
  };


  const handleViewProfile = async (st) => {
    setSelectedStudent(st);
    
    // fetch marks
    const marksQ = query(collection(db, "marks"), where("studentId", "==", st.id));
    const mSnap = await getDocs(marksQ);
    const mList = []; mSnap.forEach(d=>mList.push({id: d.id, ...d.data()}));
    setStudentMarks(mList.sort((a,b)=>b.date - a.date));

    // fetch attendance
    const attQ = query(collection(db, "attendance"), where("studentId", "==", st.id));
    const aSnap = await getDocs(attQ);
    const aList = []; aSnap.forEach(d=>aList.push({id: d.id, ...d.data()}));
    setStudentAttendance(aList);

    // fetch fees
    const feesQ = query(collection(db, "fees"), where("studentId", "==", st.id));
    const fSnap = await getDocs(feesQ);
    const fList = []; fSnap.forEach(d=>fList.push({id: d.id, ...d.data()}));
    setStudentFees(fList);
  };

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    if(!activeQuizForQuestions) return;
    const newQ = {
      question: qText,
      options: { A: qOptA, B: qOptB, C: qOptC, D: qOptD },
      correct: qCorrect
    };
    const updatedQuestions = [...(activeQuizForQuestions.questions || []), newQ];
    await updateDoc(doc(db, "quizzes", activeQuizForQuestions.id), {
      questions: updatedQuestions
    });
    setActiveQuizForQuestions({...activeQuizForQuestions, questions: updatedQuestions});
    fetchQuizzes();
    setQText(''); setQOptA(''); setQOptB(''); setQOptC(''); setQOptD(''); setQCorrect('A');
    toast.success("Question Added!");
  };

  const handleDeleteQuestion = async (index) => {
    if(!confirm("Delete this question?")) return;
    const updatedQuestions = activeQuizForQuestions.questions.filter((_, i) => i !== index);
    await updateDoc(doc(db, "quizzes", activeQuizForQuestions.id), {
      questions: updatedQuestions
    });
    setActiveQuizForQuestions({...activeQuizForQuestions, questions: updatedQuestions});
    fetchQuizzes();
  };

  // Filters
  const filteredStudents = students.filter(s => s.name.toLowerCase().includes(searchSt.toLowerCase()) || (s.class && s.class.includes(searchSt)));
  const filteredMaterials = materials.filter(m => m.title.toLowerCase().includes(searchMat.toLowerCase()) || m.subject.toLowerCase().includes(searchMat.toLowerCase()));
  const filteredQuizzes = quizzes.filter(q => q.title.toLowerCase().includes(searchQuiz.toLowerCase()));
  const filteredNotifs = notifications.filter(n => n.title.toLowerCase().includes(searchNotif.toLowerCase()));

  return (
    <div className={styles.layoutContainer}>
      {/* SIDEBAR */}
      <aside className={`${styles.sidebar} ${isMobileMenuOpen ? styles.open : ''}`}>
        <div className={styles.brand} style={{display:'flex', justifyContent:'space-between', alignItems:'center', fontSize: '1.5rem'}}>
          <img src="https://ik.imagekit.io/muthurasu/GEN%20Z/GEN_Z_LOGO__2_-removebg-preview.png.png?updatedAt=1782569180718" alt="GenZ Tuition Logo" style={{ height: '35px', objectFit: 'contain' }} />
          <button className={styles.hamburgerBtn} onClick={() => setIsMobileMenuOpen(false)} style={{display: isMobileMenuOpen ? 'block' : 'none'}}>
            <X size={24} />
          </button>
        </div>
        <div className={styles.navItems}>
          <button className={`${styles.navItem} ${activeTab === 'overview' ? styles.active : ''}`} onClick={() => {setActiveTab('overview'); setIsMobileMenuOpen(false);}}><LayoutDashboard size={20}/> Overview</button>
          <button className={`${styles.navItem} ${activeTab === 'students' ? styles.active : ''}`} onClick={() => {setActiveTab('students'); setIsMobileMenuOpen(false);}}><Users size={20}/> Students</button>
          <button className={`${styles.navItem} ${activeTab === 'records' ? styles.active : ''}`} onClick={() => {setActiveTab('records'); setIsMobileMenuOpen(false);}}><ClipboardList size={20}/> Records</button>
          <button className={`${styles.navItem} ${activeTab === 'fees' ? styles.active : ''}`} onClick={() => {setActiveTab('fees'); setIsMobileMenuOpen(false);}}><Banknote size={20}/> Fees</button>
          <button className={`${styles.navItem} ${activeTab === 'materials' ? styles.active : ''}`} onClick={() => {setActiveTab('materials'); setIsMobileMenuOpen(false);}}><BookOpen size={20}/> Materials</button>
          <button className={`${styles.navItem} ${activeTab === 'quizzes' ? styles.active : ''}`} onClick={() => {setActiveTab('quizzes'); setIsMobileMenuOpen(false);}}><FileQuestion size={20}/> Quizzes</button>
          <button className={`${styles.navItem} ${activeTab === 'notifications' ? styles.active : ''}`} onClick={() => {setActiveTab('notifications'); setIsMobileMenuOpen(false);}}><Bell size={20}/> Alerts</button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className={styles.mainContent}>
        
        {/* CRM TOP HEADER */}
        <header className={styles.topHeader}>
          <button className={styles.hamburgerBtn} onClick={() => setIsMobileMenuOpen(true)}>
            <Menu size={24} />
          </button>
          <div className={styles.headerActions}>
            <div className={styles.profileMenuContainer}>
              <button 
                className={styles.avatarBtn} 
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                A
              </button>
              
              {dropdownOpen && (
                <div className={styles.dropdownMenu}>
                  <div className={styles.dropdownInfo}>
                    <p className={styles.profileName} style={{display:'block'}}>Admin Portal</p>
                    <p className={styles.profileRole} style={{display:'block'}}>System Admin</p>
                  </div>
                  <div className={styles.dropdownDivider}></div>
                  <button className={styles.dropdownLogout} onClick={async () => { sessionStorage.removeItem('adminSession'); await signOut(auth); toast.success('Logged out successfully'); router.push('/admin/login'); }}>
                     Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className={styles.pageContent}>
          {/* OVERVIEW TAB */}
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div key="overview" initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-20}} transition={{duration:0.3}}>
                <div className={styles.pageHeader}><h1 className={styles.pageTitle}>Dashboard Overview</h1></div>
                <div className={styles.statsGrid}>
                  <motion.div whileHover={{scale:1.02, y: -4}} className={styles.statCard}>
                    <div className={styles.statIcon}><Users size={24} /></div>
                    <div className={styles.statInfo}>
                      <span className={styles.statLabel}>Total Students</span>
                      <span className={styles.statValue}>{students.length}</span>
                    </div>
                  </motion.div>
                  <motion.div whileHover={{scale:1.02, y: -4}} className={styles.statCard}>
                    <div className={styles.statIcon}><BookOpen size={24} /></div>
                    <div className={styles.statInfo}>
                      <span className={styles.statLabel}>Study Materials</span>
                      <span className={styles.statValue}>{materials.length}</span>
                    </div>
                  </motion.div>
                  <motion.div whileHover={{scale:1.02, y: -4}} className={styles.statCard}>
                    <div className={styles.statIcon}><FileQuestion size={24} /></div>
                    <div className={styles.statInfo}>
                      <span className={styles.statLabel}>Active Quizzes</span>
                      <span className={styles.statValue}>{quizzes.length}</span>
                    </div>
                  </motion.div>
                  <motion.div whileHover={{scale:1.02, y: -4}} className={styles.statCard}>
                    <div className={styles.statIcon}><Bell size={24} /></div>
                    <div className={styles.statInfo}>
                      <span className={styles.statLabel}>Notifications Sent</span>
                      <span className={styles.statValue}>{notifications.length}</span>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        {/* STUDENTS TAB */}
        {activeTab === 'students' && !selectedStudent && (
          <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{duration:0.3}}>
            <div className={styles.pageHeader}><h1 className={styles.pageTitle}>Manage Students</h1></div>
            
            {/* BULK UPLOAD */}
            <div className={styles.card} style={{ marginBottom: '2rem', border: '1px dashed var(--border-color)', background: 'var(--bg-secondary)' }}>
              <h2 className={styles.cardTitle} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><FileUp size={20} /> Bulk CSV Upload</h2>
              <form onSubmit={handleCsvUpload} style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap', marginTop: '1rem' }}>
                <input type="file" accept=".csv" onChange={(e) => setBulkCsv(e.target.files[0])} className={styles.input} style={{ flex: 1, background: 'white' }} />
                <button type="submit" className={styles.submitBtn} disabled={isUploadingCsv} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><FileUp size={18}/> {isUploadingCsv ? "Uploading..." : "Upload CSV"}</button>
                <button type="button" className={styles.btnSecondary} onClick={downloadSampleCsv} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'white', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '0.75rem 1rem', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }}><Download size={18}/> Download Sample</button>
              </form>
            </div>

            <div className={styles.card}>
              <h2 className={styles.cardTitle}>{editSt ? "Edit Student Record" : "Register Single Student"}</h2>
              <form onSubmit={handleStudent} className={styles.formGrid}>
                <div className={styles.inputGroup}><label className={styles.label}>Full Name</label><input className={styles.input} value={stName} onChange={e=>setStName(e.target.value)} required /></div>
                <div className={styles.inputGroup}><label className={styles.label}>Email Address</label><input className={styles.input} type="email" value={stEmail} onChange={e=>setStEmail(e.target.value)} required /></div>
                {!editSt && (
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Set Password</label>
                    <div style={{ position: 'relative' }}>
                      <input 
                        className={styles.input} 
                        type={showStPassword ? "text" : "password"} 
                        style={{ width: '100%', paddingRight: '40px' }}
                        value={stPassword} 
                        onChange={e=>setStPassword(e.target.value)} 
                        required 
                      />
                      <button 
                        type="button"
                        onClick={() => setShowStPassword(!showStPassword)}
                        style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
                      >
                        {showStPassword ? (
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                        )}
                      </button>
                    </div>
                  </div>
                )}
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Class</label>
                  <select className={styles.input} value={stClass} onChange={e=>setStClass(e.target.value)} required>
                    <option value="10">10</option>
                    <option value="11">11</option>
                    <option value="12">12</option>
                  </select>
                </div>
                {stClass !== '10' && (
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Department</label>
                    <select className={styles.input} value={stDept} onChange={e=>setStDept(e.target.value)} required>
                      <option value="TN State - Maths Biology">TN State - Maths Biology</option>
                      <option value="TN State - Maths Computer Science">TN State - Maths Computer Science</option>
                      <option value="TN State - Pure Science (Botany/Zoology)">TN State - Pure Science (Botany/Zoology)</option>
                      <option value="TN State - Commerce & Business Maths">TN State - Commerce & Business Maths</option>
                      <option value="TN State - Commerce & Computer Applications">TN State - Commerce & Computer Applications</option>
                      <option value="TN State - Commerce General">TN State - Commerce General</option>
                      <option value="TN State - Arts/Humanities">TN State - Arts/Humanities</option>
                      <option value="TN State - Vocational">TN State - Vocational</option>
                      <option value="CBSE - Science (PCM)">CBSE - Science (PCM)</option>
                      <option value="CBSE - Science (PCB)">CBSE - Science (PCB)</option>
                      <option value="CBSE - Science (PCMB)">CBSE - Science (PCMB)</option>
                      <option value="CBSE - Commerce with Maths">CBSE - Commerce with Maths</option>
                      <option value="CBSE - Commerce without Maths">CBSE - Commerce without Maths</option>
                      <option value="CBSE - Humanities/Arts">CBSE - Humanities/Arts</option>
                    </select>
                  </div>
                )}
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Subjects (Comma separated)</label>
                  <input className={styles.input} value={stSubjects} onChange={e=>setStSubjects(e.target.value)} required />
                </div>
                <div className={styles.fullWidth} style={{ display: 'flex', gap: '1rem' }}>
                  <button type="submit" className={styles.submitBtn} disabled={isRegistering}>
                    {isRegistering ? "Processing..." : (editSt ? "Update Student" : "Register Student")}
                  </button>
                  {editSt && <button type="button" className={styles.submitBtn} style={{background:'var(--bg-secondary)', color:'var(--text-primary)', border: '1px solid var(--border-color)'}} onClick={()=>{setEditSt(null); setStName(''); setStEmail(''); setStPassword('');}}>Cancel</button>}
                </div>
              </form>
            </div>
            
            <div className={styles.card}>
              <div className={styles.tableHeader}>
                <h2 className={styles.cardTitle} style={{border:'none', margin:0}}>Student Database</h2>
                <input type="text" className={styles.searchBar} placeholder="Search students..." value={searchSt} onChange={(e) => setSearchSt(e.target.value)} />
              </div>
              <div className={styles.dataTable}>
                {filteredStudents.map(s => (
                  <div key={s.id} className={styles.dataRow}>
                    <div className={styles.dataMain}>{s.name} <br/><span className={styles.dataSub}>{s.email}</span></div>
                    <div className={styles.dataSub}>Class: {s.class}</div>
                    <div className={styles.dataSub}>{s.department}</div>
                    <div className={styles.actionGroup}>
                      <button className={styles.editBtn} style={{background: 'rgba(6, 214, 160, 0.1)', color: 'var(--accent-secondary)'}} onClick={() => handleViewProfile(s)}>Profile</button>
                      <button className={styles.editBtn} onClick={()=>{setEditSt(s); setStName(s.name); setStEmail(s.email); setStClass(s.class); setStDept(s.department || 'Science'); setStSubjects(s.subjects || '');}}>Edit</button>
                      <button className={styles.editBtn} style={{background: 'rgba(255, 193, 7, 0.1)', color: '#ffb300'}} onClick={async () => {
                        if(confirm(`Send a password reset email to ${s.email}?`)) {
                          try {
                            await sendPasswordResetEmail(auth, s.email);
                            toast.success(`Password reset email sent to ${s.email}`);
                          } catch(err) {
                            toast.error(err.message);
                          }
                        }
                      }}>Reset Pass</button>
                      <button className={styles.deleteBtn} onClick={async ()=>{ 
                        if(confirm("Delete this student AND all their records?")) { 
                          const batch = writeBatch(db);
                          batch.delete(doc(db, "users", s.id));
                          
                          const marksQ = query(collection(db, "marks"), where("studentId", "==", s.id));
                          (await getDocs(marksQ)).forEach(doc => batch.delete(doc.ref));
                          
                          const attQ = query(collection(db, "attendance"), where("studentId", "==", s.id));
                          (await getDocs(attQ)).forEach(doc => batch.delete(doc.ref));
                          
                          await batch.commit();
                          fetchStudents(); 
                        } 
                      }}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'students' && selectedStudent && (
          <motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} transition={{duration:0.3}}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button className={styles.backBtn} onClick={() => setSelectedStudent(null)}>← Back to Students</button>
              <button className="btn-primary" onClick={() => window.print()} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--accent-secondary)' }}>
                <Printer size={18} /> Print Report
              </button>
            </div>
            <div className={styles.profileHeader}>
              <div className={styles.profileAvatar}>{selectedStudent.name[0]}</div>
              <div className={styles.profileInfo}>
                <h2>{selectedStudent.name}</h2>
                <p>{selectedStudent.email} • Class {selectedStudent.class} • {selectedStudent.department}</p>
                <p style={{marginTop: '0.5rem', color: 'var(--accent-primary)', fontWeight: 'bold'}}>
                  Attendance: {studentAttendance.length > 0 ? Math.round((studentAttendance.filter(a => a.status === 'Present').length / studentAttendance.length) * 100) : 0}% 
                  ({studentAttendance.filter(a => a.status === 'Present').length}/{studentAttendance.length} days)
                </p>
              </div>
            </div>
            
            <div className={styles.formGrid}>
              <div className={styles.card}>
                <h3 className={styles.cardTitle}>Performance History</h3>
                <div className={styles.dataTable}>
                  {studentMarks.length === 0 ? <p style={{color: 'var(--text-secondary)'}}>No marks recorded.</p> : studentMarks.map(m => (
                    <div key={m.id} className={styles.dataRow} style={{gridTemplateColumns: '1fr auto', padding: '1rem'}}>
                      <div><div className={styles.dataMain}>{m.subject}</div><div className={styles.dataSub}>{new Date(m.date?.toDate()).toLocaleDateString()}</div></div>
                      <div className={styles.dataMain} style={{color: 'var(--accent-secondary)'}}>{m.score} / {m.max}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className={styles.card}>
                <h3 className={styles.cardTitle}>Fee Records</h3>
                <div className={styles.dataTable}>
                  {studentFees.length === 0 ? <p style={{color: 'var(--text-secondary)'}}>No fees recorded.</p> : studentFees.map(f => (
                    <div key={f.id} className={styles.dataRow} style={{gridTemplateColumns: '1fr auto', padding: '1rem'}}>
                      <div><div className={styles.dataMain}>{f.month}</div><div className={styles.dataSub}>₹{f.amount}</div></div>
                      <div className={styles.dataMain} style={{color: f.status === 'Paid' ? 'var(--success)' : 'var(--danger)'}}>{f.status}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* RECORDS TAB: SPREADSHEET ATTENDANCE */}
        {activeTab === 'records' && (
          <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{duration:0.3}}>
            <div className={styles.pageHeader}><h1 className={styles.pageTitle}>Data Entry Grids</h1></div>
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Spreadsheet Attendance</h2>
              <form onSubmit={handleBatchAttendance} className={styles.formGrid}>
                <div className={styles.inputGroup}><label className={styles.label}>Class</label><input className={styles.input} placeholder="e.g. 10" value={attBatchClass} onChange={e=>setAttBatchClass(e.target.value)} required /></div>
                <div className={styles.inputGroup}><label className={styles.label}>Date</label><input className={styles.input} type="date" value={attBatchDate} onChange={e=>setAttBatchDate(e.target.value)} required /></div>
                
                <div className={styles.fullWidth} style={{background:'rgba(0,0,0,0.2)', padding:'1rem', borderRadius:'8px', marginTop:'1rem', overflowX: 'auto'}}>
                  <div style={{display:'flex', justifyContent:'space-between', marginBottom:'1rem'}}>
                    <p style={{color:'var(--warning)', fontSize:'0.9rem'}}>Uncheck to mark Absent.</p>
                    <button type="button" onClick={() => setAttBatchStatus({})} style={{background:'var(--accent-primary)', border:'none', padding:'4px 8px', borderRadius:'4px', cursor:'pointer', fontWeight:'bold', color:'black'}}>Mark All Present</button>
                  </div>
                  
                  <table style={{width: '100%', borderCollapse: 'collapse', minWidth: '400px'}}>
                    <thead>
                      <tr style={{borderBottom: '1px solid var(--border-color)', textAlign: 'left'}}>
                        <th style={{padding: '10px'}}>Student Name</th>
                        <th style={{padding: '10px'}}>Present?</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.filter(s => s.class === attBatchClass).map(s => (
                        <tr key={s.id} style={{borderBottom: '1px solid rgba(255,255,255,0.05)'}}>
                          <td style={{padding: '10px'}}>{s.name}</td>
                          <td style={{padding: '10px'}}>
                            <input type="checkbox" style={{transform: 'scale(1.5)'}} checked={attBatchStatus[s.id] !== false} onChange={(e) => setAttBatchStatus({...attBatchStatus, [s.id]: e.target.checked})} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className={styles.fullWidth}><button type="submit" className={styles.submitBtn}>Save Attendance</button></div>
              </form>
            </div>

            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Bulk Marks Entry</h2>
              <form onSubmit={handleBulkMarks} className={styles.formGrid}>
                <div className={styles.inputGroup}><label className={styles.label}>Target Class</label><input className={styles.input} value={markBatchClass} onChange={e=>setMarkBatchClass(e.target.value)} required /></div>
                <div className={styles.inputGroup}><label className={styles.label}>Subject</label><input className={styles.input} value={markBatchSubject} onChange={e=>setMarkBatchSubject(e.target.value)} required /></div>
                <div className={styles.inputGroup}><label className={styles.label}>Max Marks</label><input className={styles.input} type="number" value={markBatchMax} onChange={e=>setMarkBatchMax(e.target.value)} required /></div>
                <div className={styles.fullWidth} style={{background:'rgba(0,0,0,0.2)', padding:'1rem', borderRadius:'8px', marginTop:'1rem', overflowX: 'auto'}}>
                  <table style={{width: '100%', borderCollapse: 'collapse', minWidth: '400px'}}>
                    <thead>
                      <tr style={{borderBottom: '1px solid var(--border-color)', textAlign: 'left'}}>
                        <th style={{padding: '10px'}}>Student Name</th>
                        <th style={{padding: '10px'}}>Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.filter(s => s.class === markBatchClass).map(s => (
                        <tr key={s.id} style={{borderBottom: '1px solid rgba(255,255,255,0.05)'}}>
                          <td style={{padding: '10px'}}>{s.name}</td>
                          <td style={{padding: '10px'}}>
                            <input type="number" className={styles.input} style={{width:'100px', padding:'0.5rem'}} placeholder={`/ ${markBatchMax}`} value={markBatchScores[s.id] || ''} onChange={(e) => setMarkBatchScores({...markBatchScores, [s.id]: e.target.value})} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className={styles.fullWidth}><button type="submit" className={styles.submitBtn}>Save Bulk Marks</button></div>
              </form>
            </div>

            <div className={styles.card}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <h2 className={styles.cardTitle} style={{border:'none', margin:0}}>Low Attendance Scanner</h2>
                <button className={styles.deleteBtn} style={{background: 'var(--danger)', color: 'white', padding: '0.75rem 1.5rem', border: 'none', borderRadius: '8px', fontWeight: 'bold'}} onClick={handleScanAttendance}>Scan & Alert Defaulters</button>
              </div>
              <p style={{color: 'var(--text-secondary)', marginTop: '1rem'}}>Automatically scans all students. Anyone with less than 75% attendance (minimum 5 days recorded) will receive an automated warning notification.</p>
            </div>
          </motion.div>
        )}

        {/* FEES TAB */}
        {activeTab === 'fees' && (
          <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{duration:0.3}}>
            <div className={styles.pageHeader}><h1 className={styles.pageTitle}>Fees Management</h1></div>
            
            <div className={styles.formGrid}>
              <div className={styles.card}>
                <h2 className={styles.cardTitle}>Manual Fee Update</h2>
                <form onSubmit={handleFeeUpdate} style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Select Student</label>
                    <select className={styles.input} value={feeStudentId} onChange={e=>setFeeStudentId(e.target.value)} required>
                      <option value="">-- Select --</option>
                      {students.map(s => <option key={s.id} value={s.id}>{s.name} (Class {s.class})</option>)}
                    </select>
                  </div>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Month</label>
                    <select className={styles.input} value={feeMonth} onChange={e=>setFeeMonth(e.target.value)} required>
                      {['January','February','March','April','May','June','July','August','September','October','November','December'].map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Amount (₹)</label>
                    <input type="number" className={styles.input} value={feeAmount} onChange={e=>setFeeAmount(e.target.value)} required />
                  </div>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Status</label>
                    <select className={styles.input} value={feeStatus} onChange={e=>setFeeStatus(e.target.value)}>
                      <option value="Paid">Paid</option>
                      <option value="Pending">Pending</option>
                    </select>
                  </div>
                  {feeStatus === 'Pending' && (
                    <div className={styles.inputGroup}>
                      <label className={styles.label}>Due Date</label>
                      <input type="date" className={styles.input} value={feeDueDate} onChange={e=>setFeeDueDate(e.target.value)} required />
                    </div>
                  )}
                  <button type="submit" className={styles.submitBtn}>Save Fee Record</button>
                </form>
              </div>

              <div className={styles.card} style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
                <div>
                  <h2 className={styles.cardTitle}>Bulk Fee Generator</h2>
                  <p style={{color: 'var(--text-secondary)', marginBottom: '1rem'}}>Automatically generate pending fees for multiple students at once.</p>
                  <form onSubmit={handleBulkFees} style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                    <div className={styles.inputGroup}>
                      <label className={styles.label}>Target Class</label>
                      <select className={styles.input} value={bulkFeeClass} onChange={e=>setBulkFeeClass(e.target.value)}>
                        <option value="All">All Active Students</option>
                        {[...new Set(students.map(s => s.class))].map(c => <option key={c} value={c}>Class {c}</option>)}
                      </select>
                    </div>
                    <div className={styles.formGrid} style={{ gap: '1rem' }}>
                      <div className={styles.inputGroup}>
                        <label className={styles.label}>Month</label>
                        <select className={styles.input} value={feeMonth} onChange={e=>setFeeMonth(e.target.value)}>
                          {['January','February','March','April','May','June','July','August','September','October','November','December'].map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                      </div>
                      <div className={styles.inputGroup}>
                        <label className={styles.label}>Amount (₹)</label>
                        <input type="number" className={styles.input} value={feeAmount} onChange={e=>setFeeAmount(e.target.value)} required />
                      </div>
                    </div>
                    <div className={styles.inputGroup}>
                      <label className={styles.label}>Due Date</label>
                      <input type="date" className={styles.input} value={feeDueDate} onChange={e=>setFeeDueDate(e.target.value)} required />
                    </div>
                    <button type="submit" className={styles.submitBtn} style={{background: 'var(--accent-secondary)'}}>Generate Bulk Fees</button>
                  </form>
                </div>
                
                <div style={{borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem'}}>
                  <h2 className={styles.cardTitle}>Auto Reminders</h2>
                  <p style={{color: 'var(--text-secondary)', marginBottom: '1rem'}}>Send an automated push notification to all students who have a "Pending" fee status.</p>
                  <button type="button" onClick={handleSendFeeReminders} className={styles.submitBtn} style={{background: 'var(--danger)', width: '100%'}}>Blast Reminders to Defaulters</button>
                </div>
              </div>
            </div>
            
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Recent Fee Records</h2>
              <div className={styles.dataTable}>
                {fees.map(f => {
                  const st = students.find(s => s.id === f.studentId);
                  return (
                  <div key={f.id} className={styles.dataRow} style={{gridTemplateColumns: '2fr 1fr 1fr auto'}}>
                    <div className={styles.dataMain}>{st ? st.name : 'Unknown'}<br/><span className={styles.dataSub}>{f.month}</span></div>
                    <div className={styles.dataSub}>₹{f.amount}</div>
                    <div className={styles.dataSub} style={{color: f.status === 'Paid' ? 'var(--success)' : 'var(--danger)'}}>{f.status}</div>
                    <div className={styles.actionGroup}>
                      <button className={styles.deleteBtn} onClick={async ()=>{ await deleteDoc(doc(db, "fees", f.id)); fetchFees(); }}>Delete</button>
                    </div>
                  </div>
                )})}
              </div>
            </div>
          </motion.div>
        )}

        {/* MATERIALS TAB */}
        {activeTab === 'materials' && (
          <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{duration:0.3}}>
            <div className={styles.pageHeader}><h1 className={styles.pageTitle}>Study Materials</h1></div>
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>{editMat ? "Edit Material" : "Upload Material"}</h2>
              <form onSubmit={handleMaterial} className={styles.formGrid}>
                <div className={styles.inputGroup}><label className={styles.label}>Title</label><input className={styles.input} value={matTitle} onChange={e=>setMatTitle(e.target.value)} required /></div>
                <div className={styles.inputGroup}><label className={styles.label}>URL Link</label><input className={styles.input} type="url" value={matUrl} onChange={e=>setMatUrl(e.target.value)} required /></div>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Class</label>
                  <select className={styles.input} value={matClass} onChange={e=>setMatClass(e.target.value)} required>
                    <option value="All">All</option>
                    <option value="10">10</option>
                    <option value="11">11</option>
                    <option value="12">12</option>
                  </select>
                </div>
                {matClass !== '10' && matClass !== 'All' && (
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Department</label>
                    <select className={styles.input} value={matDept} onChange={e=>setMatDept(e.target.value)} required>
                      <option value="All">All Departments</option>
                      <option value="TN State - Maths Biology">TN State - Maths Biology</option>
                      <option value="TN State - Maths Computer Science">TN State - Maths Computer Science</option>
                      <option value="TN State - Pure Science (Botany/Zoology)">TN State - Pure Science (Botany/Zoology)</option>
                      <option value="TN State - Commerce & Business Maths">TN State - Commerce & Business Maths</option>
                      <option value="TN State - Commerce & Computer Applications">TN State - Commerce & Computer Applications</option>
                      <option value="TN State - Commerce General">TN State - Commerce General</option>
                      <option value="TN State - Arts/Humanities">TN State - Arts/Humanities</option>
                      <option value="TN State - Vocational">TN State - Vocational</option>
                      <option value="CBSE - Science (PCM)">CBSE - Science (PCM)</option>
                      <option value="CBSE - Science (PCB)">CBSE - Science (PCB)</option>
                      <option value="CBSE - Science (PCMB)">CBSE - Science (PCMB)</option>
                      <option value="CBSE - Commerce with Maths">CBSE - Commerce with Maths</option>
                      <option value="CBSE - Commerce without Maths">CBSE - Commerce without Maths</option>
                      <option value="CBSE - Humanities/Arts">CBSE - Humanities/Arts</option>
                    </select>
                  </div>
                )}
                <div className={styles.inputGroup}><label className={styles.label}>Subject</label><input className={styles.input} value={matSubject} onChange={e=>setMatSubject(e.target.value)} placeholder="e.g. Science or All" required /></div>
                <div className={styles.inputGroup}><label className={styles.label}>Type</label><input className={styles.input} value={matType} onChange={e=>setMatType(e.target.value)} required /></div>
                
                <div className={styles.inputGroup} style={{flexDirection: 'row', alignItems: 'center', gap: '0.5rem', gridColumn: '1 / -1'}}>
                  <input type="checkbox" id="autoGenQuiz" checked={autoGenMatQuiz} onChange={e=>setAutoGenMatQuiz(e.target.checked)} style={{width: '1.2rem', height: '1.2rem', accentColor: 'var(--accent-secondary)'}} />
                  <label htmlFor="autoGenQuiz" className={styles.label} style={{margin:0, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                    <BrainCircuit size={18} color="var(--accent-secondary)" /> 
                    Auto-generate AI Quiz for this material
                  </label>
                </div>

                <div className={styles.fullWidth} style={{ display: 'flex', gap: '1rem' }}>
                  <button type="submit" className={styles.submitBtn}>{editMat ? "Update Material" : "Upload & Notify"}</button>
                  {editMat && <button type="button" className={styles.submitBtn} style={{background:'var(--bg-secondary)', color:'var(--text-primary)', border: '1px solid var(--border-color)'}} onClick={()=>{setEditMat(null); setMatTitle(''); setMatUrl('');}}>Cancel</button>}
                </div>
              </form>
            </div>
            <div className={styles.card}>
              <div className={styles.tableHeader}>
                <h2 className={styles.cardTitle} style={{border:'none', margin:0}}>Files Repository</h2>
                <input type="text" className={styles.searchBar} placeholder="Search materials..." value={searchMat} onChange={(e) => setSearchMat(e.target.value)} />
              </div>
              <div className={styles.dataTable}>
                {filteredMaterials.map(m => (
                  <div key={m.id} className={styles.dataRow} style={{gridTemplateColumns: '2fr 1fr 1fr auto'}}>
                    <div className={styles.dataMain}>{m.title}</div><div className={styles.dataSub}>Class {m.class} {m.department && m.department !== 'General' ? `(${m.department})` : ''}</div><div className={styles.dataSub}>{m.subject} • {m.type}</div>
                    <div className={styles.actionGroup}>
                      <button className={styles.editBtn} style={{background: 'rgba(6, 214, 160, 0.1)', color: 'var(--accent-secondary)', display: 'flex', alignItems: 'center', gap: '4px'}} onClick={() => generateQuizFromTopic(m.title, 5, m.class, m.class === '10' ? 'General' : m.department, 30)} disabled={isGenerating}><Bot size={14} /> AI Quiz</button>
                      <button className={styles.editBtn} onClick={()=>{setEditMat(m); setMatTitle(m.title); setMatUrl(m.fileUrl); setMatClass(m.class); setMatDept(m.department || 'All'); setMatSubject(m.subject); setMatType(m.type);}}>Edit</button>
                      <button className={styles.deleteBtn} onClick={async ()=>{ await deleteDoc(doc(db, "materials", m.id)); fetchMaterials(); }}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* QUIZZES TAB */}
        {activeTab === 'quizzes' && !activeQuizForQuestions && (
          <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{duration:0.3}}>
            <div className={styles.pageHeader}><h1 className={styles.pageTitle}>Quiz Manager</h1></div>
            <div className={styles.card}>
              <div style={{display: 'flex', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem'}}>
                <button 
                  className={styles.tabBtn} 
                  style={{background: quizGenMode === 'manual' ? 'var(--accent-primary)' : 'transparent', color: quizGenMode === 'manual' ? 'white' : 'var(--text-secondary)'}}
                  onClick={() => setQuizGenMode('manual')}
                >Manual Entry</button>
                <button 
                  className={styles.tabBtn} 
                  style={{background: quizGenMode === 'ai' ? 'var(--accent-secondary)' : 'transparent', color: quizGenMode === 'ai' ? 'white' : 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem'}}
                  onClick={() => setQuizGenMode('ai')}
                ><BrainCircuit size={18} /> Auto-Generate with AI</button>
              </div>

              {quizGenMode === 'manual' ? (
                <>
                  <h2 className={styles.cardTitle}>{editQuiz ? "Edit Quiz" : "Create New Quiz"}</h2>
                  <form onSubmit={handleQuiz} className={styles.formGrid}>
                    <div className={styles.inputGroup}><label className={styles.label}>Title</label><input className={styles.input} value={quizTitle} onChange={e=>setQuizTitle(e.target.value)} required /></div>
                    <div className={styles.inputGroup}>
                      <label className={styles.label}>Class</label>
                      <select className={styles.input} value={quizClass} onChange={e=>setQuizClass(e.target.value)} required>
                        <option value="10">10</option>
                        <option value="11">11</option>
                        <option value="12">12</option>
                      </select>
                    </div>
                    {quizClass !== '10' && (
                      <div className={styles.inputGroup}>
                        <label className={styles.label}>Department</label>
                        <select className={styles.input} value={quizDept} onChange={e=>setQuizDept(e.target.value)} required>
                          <option value="All">All Departments</option>
                          <option value="TN State - Maths Biology">TN State - Maths Biology</option>
                          <option value="TN State - Maths Computer Science">TN State - Maths Computer Science</option>
                          <option value="TN State - Pure Science (Botany/Zoology)">TN State - Pure Science (Botany/Zoology)</option>
                          <option value="TN State - Commerce & Business Maths">TN State - Commerce & Business Maths</option>
                          <option value="TN State - Commerce & Computer Applications">TN State - Commerce & Computer Applications</option>
                          <option value="TN State - Commerce General">TN State - Commerce General</option>
                          <option value="TN State - Arts/Humanities">TN State - Arts/Humanities</option>
                          <option value="TN State - Vocational">TN State - Vocational</option>
                          <option value="CBSE - Science (PCM)">CBSE - Science (PCM)</option>
                          <option value="CBSE - Science (PCB)">CBSE - Science (PCB)</option>
                          <option value="CBSE - Science (PCMB)">CBSE - Science (PCMB)</option>
                          <option value="CBSE - Commerce with Maths">CBSE - Commerce with Maths</option>
                          <option value="CBSE - Commerce without Maths">CBSE - Commerce without Maths</option>
                          <option value="CBSE - Humanities/Arts">CBSE - Humanities/Arts</option>
                        </select>
                      </div>
                    )}
                    <div className={styles.inputGroup}><label className={styles.label}>Time Per Question</label><input className={styles.input} type="number" value={quizTime} onChange={e=>setQuizTime(e.target.value)} required /></div>
                    <div className={styles.fullWidth} style={{ display: 'flex', gap: '1rem' }}>
                      <button type="submit" className={styles.submitBtn}>{editQuiz ? "Update Quiz" : "Create & Notify"}</button>
                      {editQuiz && <button type="button" className={styles.submitBtn} style={{background:'var(--bg-secondary)', color:'var(--text-primary)', border: '1px solid var(--border-color)'}} onClick={()=>{setEditQuiz(null); setQuizTitle('');}}>Cancel</button>}
                    </div>
                  </form>
                </>
              ) : (
                <>
                  <h2 className={styles.cardTitle}>AI Quiz Generator</h2>
                  <p style={{color: 'var(--text-secondary)', marginBottom: '1.5rem'}}>Enter any topic and AI will instantly generate a full multiple choice quiz for you.</p>
                  <form onSubmit={handleAIQuizSubmit} className={styles.formGrid}>
                    <div className={styles.inputGroup} style={{gridColumn: '1 / -1'}}><label className={styles.label}>Topic / Title</label><input className={styles.input} value={quizGenTopic} onChange={e=>setQuizGenTopic(e.target.value)} placeholder="e.g. Photosynthesis, World War 2, Python Basics..." required /></div>
                    <div className={styles.inputGroup}>
                      <label className={styles.label}>Target Class</label>
                      <select className={styles.input} value={quizClass} onChange={e=>setQuizClass(e.target.value)} required>
                        <option value="10">10</option>
                        <option value="11">11</option>
                        <option value="12">12</option>
                      </select>
                    </div>
                    {quizClass !== '10' && (
                      <div className={styles.inputGroup}>
                        <label className={styles.label}>Department</label>
                        <select className={styles.input} value={quizDept} onChange={e=>setQuizDept(e.target.value)} required>
                          <option value="All">All Departments</option>
                          <option value="TN State - Maths Biology">TN State - Maths Biology</option>
                          <option value="TN State - Maths Computer Science">TN State - Maths Computer Science</option>
                          <option value="TN State - Pure Science (Botany/Zoology)">TN State - Pure Science (Botany/Zoology)</option>
                          <option value="TN State - Commerce & Business Maths">TN State - Commerce & Business Maths</option>
                          <option value="TN State - Commerce & Computer Applications">TN State - Commerce & Computer Applications</option>
                          <option value="TN State - Commerce General">TN State - Commerce General</option>
                          <option value="TN State - Arts/Humanities">TN State - Arts/Humanities</option>
                          <option value="TN State - Vocational">TN State - Vocational</option>
                          <option value="CBSE - Science (PCM)">CBSE - Science (PCM)</option>
                          <option value="CBSE - Science (PCB)">CBSE - Science (PCB)</option>
                          <option value="CBSE - Science (PCMB)">CBSE - Science (PCMB)</option>
                          <option value="CBSE - Commerce with Maths">CBSE - Commerce with Maths</option>
                          <option value="CBSE - Commerce without Maths">CBSE - Commerce without Maths</option>
                          <option value="CBSE - Humanities/Arts">CBSE - Humanities/Arts</option>
                        </select>
                      </div>
                    )}
                    <div className={styles.inputGroup}><label className={styles.label}>Number of Questions</label><input className={styles.input} type="number" min="1" max="20" value={quizGenNumQ} onChange={e=>setQuizGenNumQ(e.target.value)} required /></div>
                    <div className={styles.inputGroup}><label className={styles.label}>Time Per Question (sec)</label><input className={styles.input} type="number" value={quizTime} onChange={e=>setQuizTime(e.target.value)} required /></div>
                    <div className={styles.fullWidth}>
                      <button type="submit" className={styles.submitBtn} style={{background: 'var(--accent-secondary)', width: '100%', opacity: isGenerating ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'}} disabled={isGenerating}>
                        {isGenerating ? "Generating..." : <><Sparkles size={18} /> Generate Quiz & Publish</>}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
            <div className={styles.card}>
              <div className={styles.tableHeader}>
                <h2 className={styles.cardTitle} style={{border:'none', margin:0}}>Active Quizzes</h2>
                <input type="text" className={styles.searchBar} placeholder="Search quizzes..." value={searchQuiz} onChange={(e) => setSearchQuiz(e.target.value)} />
              </div>
              <div className={styles.dataTable}>
                {filteredQuizzes.map(q => (
                  <div key={q.id} className={styles.dataRow} style={{gridTemplateColumns: '2fr 1fr auto'}}>
                    <div className={styles.dataMain}>{q.title}</div><div className={styles.dataSub}>Class {q.class} {q.department && q.department !== 'General' ? `(${q.department})` : ''} • {q.timePerQ}s</div>
                    <div className={styles.actionGroup}>
                      <button className={styles.editBtn} style={{background: 'rgba(6, 214, 160, 0.1)', color: 'var(--accent-secondary)'}} onClick={() => setActiveQuizForQuestions(q)}>Questions</button>
                      <button className={styles.editBtn} onClick={()=>{setEditQuiz(q); setQuizTitle(q.title); setQuizClass(q.class); setQuizTime(q.timePerQ);}}>Edit</button>
                      <button className={styles.deleteBtn} onClick={async ()=>{ await deleteDoc(doc(db, "quizzes", q.id)); fetchQuizzes(); }}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'quizzes' && activeQuizForQuestions && (
          <motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} transition={{duration:0.3}}>
            <button className={styles.backBtn} onClick={() => setActiveQuizForQuestions(null)}>← Back to Quizzes</button>
            <div className={styles.pageHeader}><h1 className={styles.pageTitle}>{activeQuizForQuestions.title} - Questions</h1></div>
            
            <div className={styles.formGrid}>
              <div className={styles.card}>
                <h2 className={styles.cardTitle}>Add New Question</h2>
                <form onSubmit={handleAddQuestion} style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                  <div className={styles.inputGroup}><label className={styles.label}>Question Text</label><textarea className={styles.input} value={qText} onChange={e=>setQText(e.target.value)} required /></div>
                  <div className={styles.inputGroup}><label className={styles.label}>Option A</label><input className={styles.input} value={qOptA} onChange={e=>setQOptA(e.target.value)} required /></div>
                  <div className={styles.inputGroup}><label className={styles.label}>Option B</label><input className={styles.input} value={qOptB} onChange={e=>setQOptB(e.target.value)} required /></div>
                  <div className={styles.inputGroup}><label className={styles.label}>Option C</label><input className={styles.input} value={qOptC} onChange={e=>setQOptC(e.target.value)} required /></div>
                  <div className={styles.inputGroup}><label className={styles.label}>Option D</label><input className={styles.input} value={qOptD} onChange={e=>setQOptD(e.target.value)} required /></div>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Correct Option</label>
                    <select className={styles.input} value={qCorrect} onChange={e=>setQCorrect(e.target.value)}>
                      <option value="A">Option A</option><option value="B">Option B</option><option value="C">Option C</option><option value="D">Option D</option>
                    </select>
                  </div>
                  <button type="submit" className={styles.submitBtn}>Add Question</button>
                </form>
              </div>

              <div className={styles.card} style={{background: 'transparent', border: 'none', boxShadow: 'none', padding: 0}}>
                <h2 className={styles.cardTitle}>Existing Questions ({activeQuizForQuestions.questions?.length || 0})</h2>
                <div className={styles.questionList}>
                  {activeQuizForQuestions.questions?.map((q, idx) => (
                    <div key={idx} className={styles.questionCard}>
                      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                        <div className={styles.questionTitle}>Q{idx+1}. {q.question}</div>
                        <button className={styles.deleteBtn} onClick={() => handleDeleteQuestion(idx)}>Delete</button>
                      </div>
                      <div className={styles.optionsGrid}>
                        <div className={`${styles.optionItem} ${q.correct === 'A' ? styles.correct : ''}`}>A) {q.options.A}</div>
                        <div className={`${styles.optionItem} ${q.correct === 'B' ? styles.correct : ''}`}>B) {q.options.B}</div>
                        <div className={`${styles.optionItem} ${q.correct === 'C' ? styles.correct : ''}`}>C) {q.options.C}</div>
                        <div className={`${styles.optionItem} ${q.correct === 'D' ? styles.correct : ''}`}>D) {q.options.D}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* NOTIFICATIONS TAB */}
        {activeTab === 'notifications' && (
          <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{duration:0.3}}>
            <div className={styles.pageHeader}><h1 className={styles.pageTitle}>Broadcast Notifications</h1></div>
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>{editNotif ? "Edit Notification" : "Send Manual Alert"}</h2>
              <form onSubmit={handleNotification} className={styles.formGrid}>
                <div className={styles.inputGroup} style={{gridColumn: '1 / -1'}}><label className={styles.label}>Title</label><input className={styles.input} value={notifTitle} onChange={e=>setNotifTitle(e.target.value)} required /></div>
                
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Target Class</label>
                  <select className={styles.input} value={notifClass} onChange={e=>setNotifClass(e.target.value)} required>
                    <option value="All">All Classes</option>
                    <option value="10">10</option>
                    <option value="11">11</option>
                    <option value="12">12</option>
                  </select>
                </div>
                {notifClass !== '10' && notifClass !== 'All' && (
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Target Department</label>
                    <select className={styles.input} value={notifDept} onChange={e=>setNotifDept(e.target.value)} required>
                      <option value="All">All Departments</option>
                      <option value="TN State - Maths Biology">TN State - Maths Biology</option>
                      <option value="TN State - Maths Computer Science">TN State - Maths Computer Science</option>
                      <option value="TN State - Pure Science (Botany/Zoology)">TN State - Pure Science (Botany/Zoology)</option>
                      <option value="TN State - Commerce & Business Maths">TN State - Commerce & Business Maths</option>
                      <option value="TN State - Commerce & Computer Applications">TN State - Commerce & Computer Applications</option>
                      <option value="TN State - Commerce General">TN State - Commerce General</option>
                      <option value="TN State - Arts/Humanities">TN State - Arts/Humanities</option>
                      <option value="TN State - Vocational">TN State - Vocational</option>
                      <option value="CBSE - Science (PCM)">CBSE - Science (PCM)</option>
                      <option value="CBSE - Science (PCB)">CBSE - Science (PCB)</option>
                      <option value="CBSE - Science (PCMB)">CBSE - Science (PCMB)</option>
                      <option value="CBSE - Commerce with Maths">CBSE - Commerce with Maths</option>
                      <option value="CBSE - Commerce without Maths">CBSE - Commerce without Maths</option>
                      <option value="CBSE - Humanities/Arts">CBSE - Humanities/Arts</option>
                    </select>
                  </div>
                )}

                <div className={styles.inputGroup} style={{gridColumn: '1 / -1'}}><label className={styles.label}>Message</label><textarea className={styles.input} style={{height: '100px'}} value={notifMsg} onChange={e=>setNotifMsg(e.target.value)} required /></div>
                <div className={styles.fullWidth} style={{ display: 'flex', gap: '1rem' }}>
                  <button type="submit" className={styles.submitBtn}>{editNotif ? "Update Notification" : "Send Broadcast"}</button>
                  {editNotif && <button type="button" className={styles.submitBtn} style={{background:'var(--bg-secondary)', color:'var(--text-primary)', border: '1px solid var(--border-color)'}} onClick={()=>{setEditNotif(null); setNotifTitle(''); setNotifMsg('');}}>Cancel</button>}
                </div>
              </form>
            </div>
            <div className={styles.card}>
              <div className={styles.tableHeader}>
                <h2 className={styles.cardTitle} style={{border:'none', margin:0}}>Notification History</h2>
                <input type="text" className={styles.searchBar} placeholder="Search alerts..." value={searchNotif} onChange={(e) => setSearchNotif(e.target.value)} />
              </div>
              <div className={styles.dataTable}>
                {filteredNotifs.map(n => (
                  <div key={n.id} className={styles.dataRow} style={{gridTemplateColumns: '1fr auto'}}>
                    <div><div className={styles.dataMain}>{n.title}</div><div className={styles.dataSub}>{n.message}</div></div>
                    <div className={styles.actionGroup}>
                      <button className={styles.editBtn} onClick={()=>{setEditNotif(n); setNotifTitle(n.title); setNotifMsg(n.message);}}>Edit</button>
                      <button className={styles.deleteBtn} onClick={async ()=>{ await deleteDoc(doc(db, "notifications", n.id)); fetchNotifications(); }}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
        </div>
      </main>
    </div>
  );
}
