# 📘 GenZ Tuition Center - Complete User Manual

Intha document oru muzhumaiyana User Guide. Admin eppadi website ah use pannanum, Students eppadi use pannanum nu step-by-step ah theliva inga koduthurukom.

---

## 👨‍💼 PART 1: ADMIN PORTAL - HOW TO USE

Admin portal ku poga, neenga `http://localhost:3000/admin/login` page la login pannanum. Ulla ponathum 7 Tabs irukum. Athai eppadi use pandrathu nu paakalam:

### 1. Overview Tab (Dashboard)
* **Enna Iruku:** Website oda total stats inga theriym.
* **Eppadi Use Pannanum:** Neenga login pannathum first ithu thaan theriyum. Evlo students irukanga, evlo quizzes active ah iruku nu oru quick summary paathukalam.

### 2. Students Tab (Student Management)
* **Enna Iruku:** Puthu students ah add pandrathu and avanga full details paakurathu.
* **Eppadi Use Pannanum:** 
  * **Oru aala add panna:** 'Add New Student' form la Peru, Class, Email pottu Add kudunga.
  * **Mothama add panna:** Oru Excel (CSV) file la ellar peraiyum pottu 'Bulk Upload CSV' vazhiya orey adiya upload pannidalam.
  * **Profile paaka:** Oru student peru pakkathula iruka "View Profile" button ah amukkuna, avanga attendance, marks, fees ellam orey idathula pop-up aagi varum.

### 3. Records Tab (Attendance & Marks)
* **Enna Iruku:** Attendance podurathu, Marks enter pandrathu, and Warning anuppurathu.
* **Eppadi Use Pannanum:**
  * **Attendance Poda:** Oru class ah select pannunga. Ella students perum Excel sheet mari varum. Ellarum vanthurukanga na 'Mark All Present' amukkidunga. Illana specific student ku mattum 'Absent' pottu 'Save' pannunga.
  * **Attendance Warning:** Keela 'Low Attendance Scanner' nu oru red button irukum. Atha click panna, 75% ku keela attendance irukura ella students kum automatic ah Warning message poiyrum.
  * **Marks Poda:** Subject peru and Total Marks (Max Marks) enter pannitu, class ah select pannunga. Udane ellarukum marks enter pandra form varum. Type pannitu 'Save' pannidunga.

### 4. Materials Tab (Study Notes)
* **Enna Iruku:** PDF notes, Question papers upload pandrathu.
* **Eppadi Use Pannanum:** Title, Subject, Class select pannitu, PDF link ah paste panni 'Upload' kudunga. Students login panni atha download pannikuvanga.

### 5. Quizzes Tab (Online Tests)
* **Enna Iruku:** Students ku online objective test vaikalam.
* **Eppadi Use Pannanum:**
  1. Title and Timer (oru question ku evlo seconds) set pannunga.
  2. Questions ah type panni, 4 options (A, B, C, D) kuduthu ethu correct answer nu select panni "Add Question" kudunga.
  3. Ella questions um add pannathum "Save Quiz" kudunga. Automatically quiz live aagidum. Student test ezhuthunathum marks automatic ah avar profile la save aagidum! Neenga paper thirutha thevai illai.

### 6. Fees Tab (Automated Fees System)
* **Enna Iruku:** Fees management and Defaulters ku reminder anuppurathu.
* **Eppadi Use Pannanum:**
  * **Mothama Fees Poda:** 'Bulk Fee Generator' la Class, Month, Amount set panni "Generate" kudunga. Antha class la iruka ellarukum "Pending" fees record aagidum.
  * **Reminders Anuppa:** Keela iruka "Blast Reminders to Defaulters" red button ah click pannunga. Fees kattatha (Pending status) ella students kum automatic ah fees katta solli notification poiyrum.

### 7. Notifications Tab
* **Eppadi Use Pannanum:** Holiday leave or any announcement sollanum na inga type panni send pannunga. Students dashboard la adhu flash aagum.

---

## 🎓 PART 2: STUDENT PORTAL - HOW TO USE

Students `http://localhost:3000/login` page la login pannanum.

### 1. Dashboard (Main Screen)
* **Enna Iruku:** Login pannathum avanga Attendance Percentage and Total Marks perusa theriyum. 
* **Eppadi Use Pannanum:** Admin anuppuna notifications, fees reminders ellam inga top la theriyum. Keela avanga ezhuthuna test marks ellam progress bar oda varum.

### 2. Quizzes (Online Test Ezhuthurathu)
* **Enna Iruku:** Admin set panna tests inga irukum.
* **Eppadi Use Pannanum:**
  1. "Start Quiz" button ah amukkanum.
  2. Ovoru question kum options theriyum. Correct aana option ah click panni "Next" povanum.
  3. Kadaisi question la "Submit & Grade" button varum. 
  4. Submit pannathum udane avanga paper auto-correction aagi avanga score display aagum. Intha score straight ah Admin oda records ku poyrum.

### 3. Study Hub (Materials)
* **Enna Iruku:** Subject vaariyaaga folders (e.g., Maths, Science) irukum.
* **Eppadi Use Pannanum:** Avanga subject ah click panni ulla iruka PDF notes ah view/download pannikalam. Avanga class ku thakkana notes mattum thaan inga theriyum.

### 4. Performance (Marks Chart)
* **Enna Iruku:** Avanga marks eppadi improve aaguthu nu oru Graph (Bar Chart) theriyum.
* **Eppadi Use Pannanum:** Inga vanthu avanga test la evlo marks vaangi irukanga, eppadi padikranga nu visually paathukalam.

---

✨ *Intha guide ah neenga User Manual ah Admin & Students ku share pannalam.*
