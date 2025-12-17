import React, { useState, useEffect, useRef } from 'react';
import { User, Exam, ExamResult, Role, Question, LiveSession, Tingkat, QuestionBank, Announcement } from './types';
import { ChatInterface } from './components/ChatInterface';
import { 
  LayoutDashboard, Users, BookOpen, LogOut, Plus, 
  Clock, CheckCircle, BarChart3, GraduationCap, Play,
  AlertTriangle, ChevronRight, Check, Trash2, Save,
  Flag, X, Search, MoreVertical, Menu, Grid, Calendar,
  Activity, Eye, UserPlus, Timer, BookMarked, Filter,
  FileQuestion, Layers, Edit, Folder, ChevronDown, ChevronUp, FileText, XCircle, ArrowLeft, FolderPlus, ListChecks,
  Bell, Info, Megaphone, PlayCircle, History, Moon, MapPin, Hash
} from 'lucide-react';

// --- MOCK DATA INITIALIZATION ---
const INITIAL_USERS: User[] = [
  // --- ADMINS ---
  { id: '1', name: 'Administrator Pusat', username: 'admin', role: 'admin', joinedAt: '2023-01-01', alamat: 'Kantor Pusat' },
  
  // --- TEACHERS ---
  { id: '2', name: 'Ustadz Budi Santoso', username: 'ustadz', role: 'teacher', joinedAt: '2023-02-15', alamat: 'Komplek Asatidz Blok A' },
  { id: '201', name: 'Ustadzah Siti Aminah', username: 'ustadzah', role: 'teacher', joinedAt: '2023-03-10', alamat: 'Komplek Asatidz Blok B' },

  // --- STUDENTS (Data Lengkap) ---
  { id: '23001', name: 'Zaid bin Tsabit', username: '23001', role: 'student', joinedAt: '2023-07-01', tingkat: 'Idadiyah', noAbsen: 1, kelas: 'Persiapan A', alamat: 'Gedung Asrama 1, Kamar 101' },
  { id: '23002', name: 'Hasan Al-Basri', username: '23002', role: 'student', joinedAt: '2023-07-02', tingkat: 'Idadiyah', noAbsen: 2, kelas: 'Persiapan A', alamat: 'Gedung Asrama 1, Kamar 102' },
  { id: '23101', name: 'Ahmad Santri', username: 'santri', role: 'student', joinedAt: '2023-06-10', tingkat: 'Ibtidaiyah', noAbsen: 1, kelas: '1 A', alamat: 'Gedung Asrama 2, Kamar 201' },
  { id: '23102', name: 'Umar Al-Faruq', username: '23102', role: 'student', joinedAt: '2023-06-11', tingkat: 'Ibtidaiyah', noAbsen: 2, kelas: '1 A', alamat: 'Gedung Asrama 2, Kamar 202' },
  { id: '23201', name: 'Fatimah Azzahra', username: 'fatimah', role: 'student', joinedAt: '2023-06-12', tingkat: 'Tsanawiyah', noAbsen: 1, kelas: '1 B', alamat: 'Gedung Asrama Putri 2, Kamar 15' },
];

const INITIAL_BANKS: QuestionBank[] = [
  { id: 'b1', fan: 'Fiqih', bab: 'Shalat & Thaharah', tingkat: 'Ibtidaiyah', kelas: '1 A', createdAt: '2023-10-01' },
  { id: 'b2', fan: 'Nahwu', bab: 'I\'rab & Marfu\'at', tingkat: 'Tsanawiyah', kelas: '1 B', createdAt: '2023-10-02' },
];

const INITIAL_QUESTIONS: Question[] = [
  // Fiqih Ibtidaiyah (Bank b1)
  { id: 'q1', bankId: 'b1', text: 'Apa hukum shalat lima waktu bagi muslim baligh?', options: ['Sunnah', 'Wajib', 'Mubah', 'Makruh'], correctAnswer: 1, subject: 'Fiqih', bab: 'Shalat & Thaharah', tingkat: 'Ibtidaiyah', createdAt: '2023-10-01' },
  { id: 'q2', bankId: 'b1', text: 'Air yang suci dan mensucikan disebut air?', options: ['Mutanajis', 'Musta\'mal', 'Mutlaq', 'Musyammas'], correctAnswer: 2, subject: 'Fiqih', bab: 'Shalat & Thaharah', tingkat: 'Ibtidaiyah', createdAt: '2023-10-01' },
  { id: 'q3', bankId: 'b1', text: 'Berapa rakaat shalat Maghrib?', options: ['2', '3', '4', '1'], correctAnswer: 1, subject: 'Fiqih', bab: 'Shalat', tingkat: 'Ibtidaiyah', createdAt: '2023-10-01' },
  { id: 'q4', bankId: 'b1', text: 'Doa iftitah dibaca setelah?', options: ['Rukuk', 'Takbiratul Ihram', 'Sujud', 'Salam'], correctAnswer: 1, subject: 'Fiqih', bab: 'Shalat', tingkat: 'Ibtidaiyah', createdAt: '2023-10-01' },
  // Nahwu Tsanawiyah (Bank b2)
  { id: 'q5', bankId: 'b2', text: 'مَا هُوَ إِعْرَابُ كَلِمَةِ "زَيْدٌ" فِي جُمْلَةِ "قَامَ زَيْدٌ"؟', options: ['فَاعِلٌ مَرْفُوْعٌ', 'مَفْعُوْلٌ بِهِ', 'مُبْتَدَأٌ', 'خَبَرٌ'], correctAnswer: 0, subject: 'Nahwu', bab: 'I\'rab', tingkat: 'Tsanawiyah', createdAt: '2023-10-09' }
];

const INITIAL_EXAMS: Exam[] = [
  {
    id: 'e1',
    title: 'Imtihan Fiqih Dasar',
    subject: 'Fiqih',
    tingkat: 'Ibtidaiyah',
    durationMinutes: 45,
    status: 'active',
    authorId: '2',
    createdAt: '2023-10-01',
    scheduledStart: new Date(new Date().setHours(new Date().getHours() - 1)).toISOString(), 
    scheduledEnd: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString(),
    questions: [INITIAL_QUESTIONS[0], INITIAL_QUESTIONS[1], INITIAL_QUESTIONS[2], INITIAL_QUESTIONS[3]]
  }
];

// --- HELPERS ---
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function isArabic(text: string): boolean {
  const arabicPattern = /[\u0600-\u06FF]/;
  return arabicPattern.test(text);
}

function toHijri(dateInput: string | Date, includeTime: boolean = false): string {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  const options: Intl.DateTimeFormatOptions = { calendar: 'islamic-umalqura', year: 'numeric', month: 'long', day: 'numeric' };
  let hijri = new Intl.DateTimeFormat('id-ID-u-ca-islamic-umalqura', options).format(date);
  if (includeTime) hijri += ` • ${date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB`;
  return hijri;
}

// --- COMPONENTS ---

const Toast = ({ message, type, onClose }: { message: string, type: 'success' | 'error', onClose: () => void }) => {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  return (
    <div className={`fixed top-4 right-4 z-[100] px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-right ${type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-500 text-white'}`}>
      {type === 'success' ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
      <span className="font-medium text-sm">{message}</span>
    </div>
  );
};

// 2. LOGIN COMPONENT
const LoginView = ({ onLogin, users }: { onLogin: (u: User) => void, users: User[] }) => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = users.find(u => u.username === username || u.id === username);
    if (user) {
      onLogin(user);
    } else {
      setError('ID Santri atau Username tidak ditemukan.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-600/20 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-teal-600/20 rounded-full blur-[100px]"></div>

      <div className="bg-white/95 backdrop-blur-xl w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col relative z-10 border border-white/20 mx-4 md:mx-0">
        <div className="bg-gradient-to-br from-emerald-700 to-teal-800 p-8 md:p-10 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] opacity-20"></div>
          <div className="bg-white/20 w-16 h-16 md:w-20 md:h-20 rounded-2xl mx-auto flex items-center justify-center mb-6 backdrop-blur-md shadow-inner ring-1 ring-white/30">
             <BookMarked size={32} className="text-white md:hidden" />
             <BookMarked size={40} className="text-white hidden md:block" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 tracking-tight">Pesantren Digital</h1>
          <p className="text-emerald-100 text-xs md:text-sm font-medium">Sistem Akademik & Ujian Santri</p>
        </div>
        
        <div className="p-6 md:p-8 pt-8 md:pt-10">
          <form onSubmit={handleLogin} className="space-y-5 md:space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Username / ID Santri (NIS)</label>
              <div className="relative">
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 md:py-4 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all text-slate-800 placeholder-slate-400 bg-slate-50 focus:bg-white font-medium text-sm md:text-base"
                  placeholder="Contoh: 23001"
                />
                <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              </div>
            </div>
            
            {error && (
              <div className="text-red-600 text-xs md:text-sm bg-red-50 p-3 md:p-4 rounded-xl flex items-center gap-3 border border-red-100 animate-pulse">
                <AlertTriangle size={18} className="shrink-0"/> 
                {error}
              </div>
            )}

            <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 md:py-4 rounded-xl shadow-xl shadow-emerald-500/30 transition-all transform hover:-translate-y-1 active:translate-y-0 text-sm md:text-base">
              Masuk Sistem
            </button>
            
            <div className="text-center mt-6">
              <p className="text-xs text-slate-400 mb-2">Akun Demo Cepat:</p>
              <div className="flex flex-wrap justify-center gap-2 text-[10px] md:text-xs font-mono">
                <button type="button" onClick={() => setUsername('admin')} className="bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded text-slate-600 transition">admin</button>
                <button type="button" onClick={() => setUsername('ustadz')} className="bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded text-slate-600 transition">ustadz</button>
                <button type="button" onClick={() => setUsername('23001')} className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 px-2 py-1 rounded transition">23001 (Santri)</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// 3. EXAM RUNNER & HELPERS (FULL FEATURED)
interface RandomizedQuestion extends Question {
  originalIndex: number;
  shuffledOptions: string[];
  shuffledToOriginalOptionMap: number[];
}

const ExamRunner = ({ exam, student, onFinish }: { exam: Exam, student: User, onFinish: (res: ExamResult) => void }) => {
  const [questions, setQuestions] = useState<RandomizedQuestion[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState(exam.durationMinutes * 60);
  const [questionDurations, setQuestionDurations] = useState<Record<string, number>>({});
  const lastSwitchTime = useRef<number>(Date.now());
  const examStartTime = useRef<number>(Date.now());
  const [isReady, setIsReady] = useState(false);

  const storageKey = `exam_progress_${student.id}_${exam.id}`;

  // 1. Initialize or Resume
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      const parsed = JSON.parse(saved);
      setQuestions(parsed.questions);
      setAnswers(parsed.answers);
      setTimeLeft(parsed.timeLeft);
      setQuestionDurations(parsed.questionDurations || {});
      examStartTime.current = parsed.startTime || Date.now();
      setIsReady(true);
    } else {
      const processed = shuffleArray([...exam.questions]).map(q => {
        const originalIndices = q.options.map((_, i) => i);
        const shuffledIndices = shuffleArray(originalIndices);
        return {
          ...q,
          originalIndex: exam.questions.findIndex(eq => eq.id === q.id),
          shuffledOptions: shuffledIndices.map(i => q.options[i]),
          shuffledToOriginalOptionMap: shuffledIndices
        };
      });
      setQuestions(processed);
      setIsReady(true);
    }
  }, [exam.id, student.id]);

  // 2. Timer & Auto-Save
  useEffect(() => {
    if (!isReady) return;
    
    lastSwitchTime.current = Date.now(); 

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isReady]);

  // Save progress on change
  useEffect(() => {
    if (!isReady) return;
    const data = {
      questions, answers, timeLeft, questionDurations, 
      startTime: examStartTime.current,
      lastUpdated: Date.now()
    };
    localStorage.setItem(storageKey, JSON.stringify(data));
  }, [answers, timeLeft, currentQ, questions]);

  const recordCurrentDuration = () => {
    const now = Date.now();
    const elapsed = (now - lastSwitchTime.current) / 1000;
    const qId = questions[currentQ].id;
    setQuestionDurations(prev => ({ ...prev, [qId]: (prev[qId] || 0) + elapsed }));
    lastSwitchTime.current = now;
  };

  const handleNav = (idx: number) => {
    recordCurrentDuration();
    setCurrentQ(idx);
  };

  const handleAnswer = (optIdx: number) => {
    setAnswers(prev => ({ ...prev, [questions[currentQ].id]: optIdx }));
  };

  const handleSubmit = () => {
    recordCurrentDuration();
    
    let correct = 0;
    const finalAnswers: Record<string, number> = {};
    questions.forEach(q => {
      const userShuffled = answers[q.id];
      if (userShuffled !== undefined) {
        const originalOpt = q.shuffledToOriginalOptionMap[userShuffled];
        finalAnswers[q.id] = originalOpt;
        if (originalOpt === q.correctAnswer) correct++;
      }
    });

    const score = Math.round((correct / exam.questions.length) * 100);
    const totalDuration = (Date.now() - examStartTime.current) / 1000;

    const result: ExamResult = {
      id: Date.now().toString(),
      examId: exam.id,
      studentId: student.id,
      score,
      answers: finalAnswers,
      submittedAt: new Date().toISOString(),
      durationSeconds: totalDuration,
      questionDurations: questionDurations 
    };

    localStorage.removeItem(storageKey);
    onFinish(result);
  };

  if (!isReady) return <div className="p-10 text-center">Memuat Ujian...</div>;

  const currQ = questions[currentQ];
  const isArabicText = isArabic(currQ.text);

  return (
    <div className="fixed inset-0 bg-slate-50 z-50 flex flex-col">
      {/* Header */}
      <div className="bg-white px-6 py-3 border-b flex justify-between items-center shadow-sm h-16 shrink-0">
        <div>
          <h2 className="font-bold text-lg">{exam.title}</h2>
          <div className="text-xs text-slate-500">Soal {currentQ + 1} dari {questions.length}</div>
        </div>
        <div className="flex items-center gap-4">
          <div className={`text-xl font-mono font-bold ${timeLeft < 300 ? 'text-red-500 animate-pulse' : 'text-slate-800'}`}>
            {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
          </div>
          <button onClick={() => { if(window.confirm('Kumpulkan jawaban?')) handleSubmit(); }} className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-bold text-sm hover:bg-emerald-700 transition">Selesai</button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Nav */}
        <div className="w-72 bg-white border-r p-4 overflow-y-auto hidden md:block">
          <div className="mb-4 text-xs font-bold text-slate-400 uppercase">Navigasi Soal</div>
          <div className="grid grid-cols-5 gap-2">
            {questions.map((q, idx) => (
              <button 
                key={q.id} 
                onClick={() => handleNav(idx)}
                className={`aspect-square rounded-lg border text-sm font-bold transition-all
                  ${currentQ === idx ? 'bg-emerald-600 text-white border-emerald-600 shadow-md transform scale-105' : 
                    answers[q.id] !== undefined ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Question Area */}
        <div className="flex-1 p-6 overflow-y-auto bg-slate-50">
          <div className="max-w-3xl mx-auto pb-20">
             <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 mb-6 min-h-[150px] flex items-center">
                <p className={`text-xl leading-relaxed font-medium text-slate-800 w-full ${isArabicText ? 'font-arabic text-2xl text-right' : ''}`} dir={isArabicText ? 'rtl' : 'auto'}>
                  {currQ.text}
                </p>
             </div>

             <div className="space-y-3">
               {currQ.shuffledOptions.map((opt, idx) => {
                 const isSelected = answers[currQ.id] === idx;
                 return (
                   <button 
                    key={idx}
                    onClick={() => handleAnswer(idx)}
                    className={`w-full p-4 rounded-xl text-left border-2 transition-all flex gap-4 items-center group ${isSelected ? 'border-emerald-500 bg-emerald-50/50' : 'border-transparent bg-white hover:bg-slate-50 hover:border-slate-200'}`}
                   >
                     <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm border transition-colors ${isSelected ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white border-slate-200 text-slate-500 group-hover:border-emerald-300 group-hover:text-emerald-600'}`}>
                       {String.fromCharCode(65+idx)}
                     </div>
                     <div className={`text-base font-medium ${isArabic(opt) ? 'font-arabic text-xl text-right w-full' : 'text-slate-700'}`} dir={isArabic(opt) ? 'rtl' : 'auto'}>{opt}</div>
                   </button>
                 )
               })}
             </div>

             <div className="flex justify-between mt-10 pt-6 border-t border-slate-200">
               <button disabled={currentQ === 0} onClick={() => handleNav(currentQ - 1)} className="px-6 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                 <ArrowLeft size={18}/> Sebelumnya
               </button>
               {currentQ < questions.length - 1 ? (
                 <button onClick={() => handleNav(currentQ + 1)} className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-500/20 flex items-center gap-2">
                   Selanjutnya <ChevronRight size={18}/>
                 </button>
               ) : (
                 <button onClick={handleSubmit} className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-500/20 flex items-center gap-2">
                   Selesai <Check size={18}/>
                 </button>
               )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 4. SIDEBAR ITEM & STAT CARD
const SidebarItem = ({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all mb-1 group relative overflow-hidden ${active ? 'bg-emerald-800 text-white shadow-lg' : 'text-emerald-100 hover:bg-emerald-800/50'}`}>
    {active && <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-400"></div>}
    <div className={`transition-transform ${active ? 'scale-110' : 'group-hover:scale-110'}`}>{icon}</div>
    <span className={`font-medium text-sm tracking-wide ${active ? 'font-bold' : ''}`}>{label}</span>
  </button>
);
const StatCard = ({ title, value, icon, bg, trend }: any) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
    <div className="flex justify-between items-start mb-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:rotate-6 ${bg}`}>{icon}</div>
      <div className="px-2 py-1 bg-slate-50 rounded-lg text-[10px] font-bold text-slate-500 uppercase tracking-wider border border-slate-100">{trend}</div>
    </div>
    <h3 className="text-slate-500 text-sm font-medium mb-1">{title}</h3>
    <p className="text-2xl font-bold text-slate-800">{value}</p>
  </div>
);

// 5. MAIN APP
const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [exams, setExams] = useState<Exam[]>(INITIAL_EXAMS);
  const [results, setResults] = useState<ExamResult[]>([]);
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeExam, setActiveExam] = useState<Exam | null>(null);
  const [viewingResult, setViewingResult] = useState<ExamResult | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [toast, setToast] = useState<{msg: string, type: 'success'|'error'} | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Modals
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', username: '', role: 'student' as Role, tingkat: 'Idadiyah' as Tingkat, noAbsen: '', kelas: '', alamat: '' });

  const showToast = (msg: string, type: 'success' | 'error') => setToast({ msg, type });

  const handleAddUser = () => {
    if (!newUser.name || !newUser.username) return showToast("Nama dan ID/Username wajib diisi!", "error");
    const absenNum = newUser.noAbsen ? parseInt(newUser.noAbsen) : undefined;
    const user: User = {
      id: newUser.username, 
      name: newUser.name,
      username: newUser.username,
      role: newUser.role,
      tingkat: newUser.role === 'student' ? newUser.tingkat : undefined,
      noAbsen: absenNum,
      kelas: newUser.kelas,
      alamat: newUser.alamat,
      joinedAt: new Date().toISOString().split('T')[0]
    };
    setUsers([...users, user]);
    setShowAddUser(false);
    setNewUser({ name: '', username: '', role: 'student', tingkat: 'Idadiyah', noAbsen: '', kelas: '', alamat: '' });
    showToast("Data berhasil ditambahkan!", "success");
  };

  const handleDeleteUser = (id: string) => {
    if (window.confirm("Yakin ingin menghapus user ini?")) {
      setUsers(users.filter(u => u.id !== id));
      showToast("User berhasil dihapus", "success");
    }
  };

  const handleFinishExam = (res: ExamResult) => {
    setResults(prev => [...prev, res]);
    setActiveExam(null);
    setViewingResult(res);
  };

  if (!currentUser) {
    return <LoginView onLogin={(u) => { setCurrentUser(u); setActiveTab('dashboard'); }} users={users} />;
  }

  if (activeExam && currentUser.role === 'student') {
    return <ExamRunner exam={activeExam} student={currentUser} onFinish={handleFinishExam} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-800 overflow-hidden">
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      <aside className={`fixed inset-y-0 left-0 z-30 w-72 bg-[#064e3b] text-emerald-100 flex flex-col transition-transform duration-300 md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 font-bold text-xl text-white flex items-center gap-3"><BookMarked size={24}/> Ma'had App</div>
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          <SidebarItem icon={<LayoutDashboard size={20}/>} label="Beranda" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          {currentUser.role === 'teacher' && (
             <>
               <div className="pt-4 pb-2 px-4 text-xs font-bold text-emerald-400/70 uppercase">Akademik</div>
               <SidebarItem icon={<Users size={20}/>} label="Data Santri" active={activeTab === 'students_manage'} onClick={() => setActiveTab('students_manage')} />
             </>
          )}
          {currentUser.role === 'admin' && (
             <>
               <div className="pt-4 pb-2 px-4 text-xs font-bold text-emerald-400/70 uppercase">Admin</div>
               <SidebarItem icon={<Users size={20}/>} label="Manajemen User" active={activeTab === 'users'} onClick={() => setActiveTab('users')} />
             </>
          )}
          {currentUser.role === 'student' && (
             <>
               <SidebarItem icon={<BookOpen size={20}/>} label="Ujian Saya" active={activeTab === 'exams'} onClick={() => setActiveTab('exams')} />
               <SidebarItem icon={<History size={20}/>} label="Riwayat" active={activeTab === 'history'} onClick={() => setActiveTab('history')} />
             </>
          )}
        </nav>
        <div className="p-4 bg-[#064e3b] border-t border-emerald-800">
           <button onClick={() => setShowChat(!showChat)} className="w-full flex items-center gap-2 px-4 py-3 bg-emerald-900/50 rounded-xl hover:bg-emerald-800 transition"><Search size={16} className="text-yellow-300"/> Tanya AI</button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 bg-white border-b flex items-center justify-between px-6 shrink-0 z-20">
           <div className="flex items-center gap-3">
              <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="md:hidden"><Menu/></button>
              <h2 className="font-bold text-lg capitalize">{activeTab.replace('_', ' ')}</h2>
           </div>
           <div className="flex items-center gap-3">
              <span className="text-sm font-bold">{currentUser.name}</span>
              <button onClick={() => setCurrentUser(null)} className="p-2 bg-red-50 text-red-500 rounded-lg"><LogOut size={18}/></button>
           </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 relative">
           {activeTab === 'dashboard' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <StatCard title="Total Santri" value={users.filter(u => u.role === 'student').length} icon={<Users className="text-blue-600"/>} bg="bg-blue-100" trend="Aktif"/>
                 <StatCard title="Total Ujian" value={exams.length} icon={<BookOpen className="text-emerald-600"/>} bg="bg-emerald-100" trend="Tersedia"/>
              </div>
           )}

           {/* STUDENT: EXAM LIST */}
           {activeTab === 'exams' && currentUser.role === 'student' && (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {exams.map(exam => {
                 const hasProgress = localStorage.getItem(`exam_progress_${currentUser.id}_${exam.id}`);
                 const isDone = results.some(r => r.examId === exam.id && r.studentId === currentUser.id);
                 return (
                   <div key={exam.id} className="bg-white p-6 rounded-2xl border hover:border-emerald-400 transition shadow-sm group">
                     <div className="flex justify-between items-start mb-4">
                       <div>
                         <span className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded text-xs font-bold border border-emerald-100">{exam.subject}</span>
                         <h3 className="font-bold text-lg mt-2">{exam.title}</h3>
                       </div>
                       <Clock className="text-slate-300" />
                     </div>
                     {isDone ? (
                       <button onClick={() => setViewingResult(results.find(r => r.examId === exam.id && r.studentId === currentUser.id)!)} className="w-full py-3 rounded-xl bg-blue-50 text-blue-600 font-bold border border-blue-100 hover:bg-blue-100 flex items-center justify-center gap-2">
                         <CheckCircle size={18} /> Lihat Hasil
                       </button>
                     ) : (
                       <button onClick={() => setActiveExam(exam)} className="w-full py-3 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2">
                         {hasProgress ? <><PlayCircle size={18}/> Lanjutkan Ujian</> : <><Play size={18}/> Mulai Ujian</>}
                       </button>
                     )}
                   </div>
                 );
               })}
             </div>
           )}

            {/* STUDENT: HISTORY */}
            {activeTab === 'history' && currentUser.role === 'student' && (
              <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b">
                    <tr>
                      <th className="p-4 text-xs font-bold text-slate-500 uppercase">Ujian</th>
                      <th className="p-4 text-xs font-bold text-slate-500 uppercase">Waktu</th>
                      <th className="p-4 text-xs font-bold text-slate-500 uppercase">Nilai</th>
                      <th className="p-4 text-xs font-bold text-slate-500 uppercase text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {results.filter(r => r.studentId === currentUser.id).map(r => {
                      const exam = exams.find(e => e.id === r.examId);
                      return (
                        <tr key={r.id}>
                          <td className="p-4 font-medium">{exam?.title}</td>
                          <td className="p-4 text-slate-500 text-sm">{toHijri(r.submittedAt)}</td>
                          <td className="p-4 font-bold">{r.score}</td>
                          <td className="p-4 text-right">
                            <button onClick={() => setViewingResult(r)} className="text-emerald-600 font-bold text-sm hover:underline">Detail</button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}

           {/* USER MANAGEMENT */}
           {(activeTab === 'users' || activeTab === 'students_manage') && (
            <div className="space-y-6">
               <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                  <div>
                     <h3 className="font-bold text-slate-800">{activeTab === 'users' ? 'Manajemen User' : 'Data Santri Lengkap'}</h3>
                     <p className="text-xs text-slate-500">Kelola data {activeTab === 'users' ? 'pengguna sistem' : 'santri, kelas, dan alamat'}</p>
                  </div>
                  <button onClick={() => setShowAddUser(true)} className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition shadow-lg shadow-emerald-500/20 font-bold text-sm">
                     <UserPlus size={16} /> Tambah {activeTab === 'users' ? 'User' : 'Santri'}
                  </button>
               </div>
               
               <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                 <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">ID / NIS</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Nama Lengkap</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Kelas</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Absen</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Role/Tingkat</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Alamat</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {users
                        .filter(u => activeTab === 'users' ? true : u.role === 'student')
                        .map(user => (
                        <tr key={user.id} className="hover:bg-slate-50 transition group">
                          <td className="px-6 py-4">
                            <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded text-slate-700 font-bold">{user.id}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-bold text-slate-700 text-sm">{user.name}</div>
                            {user.role === 'student' && <div className="text-[10px] text-slate-400">Username: {user.username}</div>}
                          </td>
                          <td className="px-6 py-4">
                            {user.kelas ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700">
                                {user.kelas}
                              </span>
                            ) : <span className="text-slate-300">-</span>}
                          </td>
                          <td className="px-6 py-4 text-sm font-mono text-slate-600">
                             {user.noAbsen ? `#${user.noAbsen}` : <span className="text-slate-300">-</span>}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase border ${
                              user.role === 'admin' ? 'bg-red-50 text-red-600 border-red-100' : 
                              user.role === 'teacher' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                            }`}>
                              {user.role === 'student' ? user.tingkat : user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-xs text-slate-500 max-w-[200px] truncate" title={user.alamat}>
                             {user.alamat ? (
                                <div className="flex items-center gap-1"><MapPin size={12} className="shrink-0"/> {user.alamat}</div>
                             ) : <span className="text-slate-300">-</span>}
                          </td>
                          <td className="px-6 py-4 text-right">
                             {user.id !== currentUser.id && (
                               <button onClick={() => handleDeleteUser(user.id)} className="p-2 text-red-300 hover:bg-red-50 hover:text-red-600 rounded-lg transition" title="Hapus User">
                                 <Trash2 size={16}/>
                               </button>
                             )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                 </div>
               </div>
            </div>
           )}

           {/* ADD USER MODAL */}
           {showAddUser && (
            <div className="fixed inset-0 bg-black/50 z-[70] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
              <div className="bg-white rounded-2xl p-6 md:p-8 max-w-lg w-full shadow-2xl overflow-y-auto max-h-[90vh]">
                 <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-xl text-slate-800">Tambah {newUser.role === 'student' ? 'Santri' : 'User'} Baru</h3>
                    <button onClick={() => setShowAddUser(false)}><X size={24} className="text-slate-400"/></button>
                 </div>
                 <div className="space-y-4">
                    {/* Role Selection (Only Admin) */}
                    {currentUser.role === 'admin' && (
                      <div>
                         <label className="block text-sm font-bold text-slate-700 mb-1">Tipe User</label>
                         <div className="flex gap-2 p-1 bg-slate-100 rounded-lg">
                            {['student', 'teacher', 'admin'].map((r) => (
                              <button key={r} onClick={() => setNewUser({...newUser, role: r as Role})} 
                                className={`flex-1 py-2 text-xs font-bold uppercase rounded-md transition ${newUser.role === r ? 'bg-white shadow text-emerald-600' : 'text-slate-500 hover:bg-slate-200'}`}>
                                {r}
                              </button>
                            ))}
                         </div>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div className="md:col-span-2">
                          <label className="block text-sm font-bold text-slate-700 mb-1">Nama Lengkap</label>
                          <input type="text" className="w-full px-4 py-2 border rounded-lg focus:ring-emerald-500 outline-none" 
                             value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} placeholder="Nama Lengkap" />
                       </div>
                       
                       <div className="md:col-span-2">
                          <label className="block text-sm font-bold text-slate-700 mb-1">
                             {newUser.role === 'student' ? 'Nomor Induk Santri (ID)' : 'Username Login'}
                          </label>
                          <div className="relative">
                             <input type="text" className="w-full pl-10 px-4 py-2 border rounded-lg focus:ring-emerald-500 outline-none font-mono" 
                                value={newUser.username} onChange={e => setNewUser({...newUser, username: e.target.value})} placeholder={newUser.role === 'student' ? "Contoh: 23001" : "username_login"} />
                             <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                {newUser.role === 'student' ? <Hash size={16}/> : <Users size={16}/>}
                             </div>
                          </div>
                          <p className="text-[10px] text-slate-500 mt-1 ml-1">
                             {newUser.role === 'student' ? 'ID ini akan digunakan sebagai Username untuk login santri.' : 'Username digunakan untuk login.'}
                          </p>
                       </div>

                       {(newUser.role === 'student' || currentUser.role === 'teacher') && (
                         <>
                            <div>
                               <label className="block text-sm font-bold text-slate-700 mb-1">Tingkat</label>
                               <select className="w-full px-4 py-2 border rounded-lg focus:ring-emerald-500 outline-none bg-white"
                                  value={newUser.tingkat} onChange={e => setNewUser({...newUser, tingkat: e.target.value as Tingkat})}>
                                  <option value="Idadiyah">Idadiyah</option>
                                  <option value="Ibtidaiyah">Ibtidaiyah</option>
                                  <option value="Tsanawiyah">Tsanawiyah</option>
                                  <option value="Aliyah">Aliyah</option>
                               </select>
                            </div>
                            <div>
                               <label className="block text-sm font-bold text-slate-700 mb-1">Kelas</label>
                               <input type="text" className="w-full px-4 py-2 border rounded-lg focus:ring-emerald-500 outline-none" 
                                  value={newUser.kelas} onChange={e => setNewUser({...newUser, kelas: e.target.value})} placeholder="Contoh: 1 A" />
                            </div>
                            <div>
                               <label className="block text-sm font-bold text-slate-700 mb-1">No Absen</label>
                               <input type="number" className="w-full px-4 py-2 border rounded-lg focus:ring-emerald-500 outline-none" 
                                  value={newUser.noAbsen} onChange={e => setNewUser({...newUser, noAbsen: e.target.value})} placeholder="0" />
                            </div>
                         </>
                       )}
                       
                       <div className={newUser.role === 'student' ? "md:col-span-1" : "md:col-span-2"}>
                          <label className="block text-sm font-bold text-slate-700 mb-1">Alamat Domisili</label>
                          <input type="text" className="w-full px-4 py-2 border rounded-lg focus:ring-emerald-500 outline-none" 
                             value={newUser.alamat} onChange={e => setNewUser({...newUser, alamat: e.target.value})} placeholder="Gedung/Kamar atau Alamat Rumah" />
                       </div>
                    </div>

                    <button onClick={handleAddUser} className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl mt-4 shadow-lg">Simpan Data</button>
                 </div>
              </div>
            </div>
           )}

           {/* VIEW RESULT MODAL (DETAIL LENGKAP) */}
           {viewingResult && (
             <div className="fixed inset-0 bg-black/60 z-[70] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
               <div className="bg-white rounded-2xl md:rounded-3xl p-0 max-w-4xl w-full shadow-2xl h-[90vh] flex flex-col relative overflow-hidden">
                  {/* Header Fixed */}
                  <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white z-10 shrink-0">
                     <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                           <ListChecks size={24} />
                        </div>
                        <div>
                           <h3 className="text-xl font-bold text-slate-800 leading-none">Hasil Ujian Detail</h3>
                           <p className="text-slate-500 text-sm mt-1">Evaluasi & Analisis Jawaban</p>
                        </div>
                     </div>
                     <button onClick={() => setViewingResult(null)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition"><X size={24}/></button>
                  </div>

                  {/* Content Scrollable */}
                  <div className="flex-1 overflow-y-auto bg-slate-50 p-6 space-y-6">
                     {(() => {
                         const exam = exams.find(e => e.id === viewingResult.examId);
                         if (!exam) return null;
                         const correctCount = exam.questions.reduce((acc, q) => viewingResult.answers[q.id] === q.correctAnswer ? acc + 1 : acc, 0);
                         const wrongCount = exam.questions.length - correctCount;

                         return (
                            <>
                               {/* Score Cards */}
                               <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                   <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center relative overflow-hidden">
                                       <span className="text-xs text-slate-500 font-bold uppercase mb-1 z-10">Nilai Akhir</span>
                                       <span className={`text-5xl font-black z-10 ${viewingResult.score >= 70 ? 'text-emerald-600' : 'text-red-600'}`}>{viewingResult.score}</span>
                                       <GraduationCap className={`absolute -right-4 -top-4 opacity-10 ${viewingResult.score >= 70 ? 'text-emerald-500' : 'text-red-500'}`} size={80}/>
                                   </div>
                                   <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 text-center">
                                       <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2"><Check size={16}/></div>
                                       <div className="text-2xl font-black text-emerald-700">{correctCount}</div>
                                       <div className="text-[10px] font-bold text-emerald-600 uppercase">Benar</div>
                                   </div>
                                   <div className="bg-red-50 p-4 rounded-2xl border border-red-100 text-center">
                                       <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-2"><X size={16}/></div>
                                       <div className="text-2xl font-black text-red-700">{wrongCount}</div>
                                       <div className="text-[10px] font-bold text-red-600 uppercase">Salah</div>
                                   </div>
                                   <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 text-center">
                                       <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-2"><Clock size={16}/></div>
                                       <div className="text-lg font-black text-blue-700 font-mono">
                                          {Math.floor((viewingResult.durationSeconds||0)/60)}m {(viewingResult.durationSeconds||0)%60}s
                                       </div>
                                       <div className="text-[10px] font-bold text-blue-600 uppercase">Durasi</div>
                                   </div>
                               </div>

                               {/* Question Breakdown */}
                               <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                                  <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                     Rincian Jawaban
                                  </div>
                                  <div className="divide-y divide-slate-100">
                                     {exam.questions.map((q, idx) => {
                                         const userAns = viewingResult.answers[q.id];
                                         const isCorrect = userAns === q.correctAnswer;
                                         const duration = viewingResult.questionDurations?.[q.id] || 0;
                                         return (
                                             <div key={q.id} className="p-6 hover:bg-slate-50 transition">
                                                 <div className="flex justify-between items-start mb-3">
                                                      <div className="flex items-center gap-3">
                                                         <span className={`w-8 h-8 flex items-center justify-center rounded-lg font-bold text-sm ${isCorrect ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>{idx+1}</span>
                                                         <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase border ${isCorrect ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-red-50 text-red-600 border-red-200'}`}>
                                                            {isCorrect ? 'Jawaban Benar' : 'Jawaban Salah'}
                                                         </span>
                                                      </div>
                                                      <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                                                          <Timer size={14}/> {duration < 60 ? `${Math.floor(duration)}s` : `${Math.floor(duration/60)}m`}
                                                      </div>
                                                 </div>
                                                 <p className={`text-slate-800 font-medium mb-4 ${isArabic(q.text) ? 'font-arabic text-xl text-right' : ''}`} dir={isArabic(q.text)?'rtl':'auto'}>{q.text}</p>
                                                 
                                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                                     <div className={`p-3 rounded-lg border ${isCorrect ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
                                                         <span className={`text-[10px] font-bold uppercase block mb-1 ${isCorrect ? 'text-emerald-600' : 'text-red-600'}`}>Jawaban Santri</span>
                                                         <div className="font-bold">{userAns !== undefined ? q.options[userAns] : <span className="italic text-slate-400">Tidak dijawab</span>}</div>
                                                     </div>
                                                     {!isCorrect && (
                                                       <div className="p-3 rounded-lg border bg-slate-50 border-slate-200">
                                                           <span className="text-[10px] font-bold uppercase block mb-1 text-slate-500">Kunci Jawaban</span>
                                                           <div className="font-bold text-slate-700">{q.options[q.correctAnswer]}</div>
                                                       </div>
                                                     )}
                                                 </div>
                                             </div>
                                         )
                                     })}
                                  </div>
                               </div>
                            </>
                         );
                     })()}
                  </div>

                  {/* Footer Fixed */}
                  <div className="px-6 py-4 border-t border-slate-200 bg-white flex justify-end shrink-0 z-20">
                     <button onClick={() => setViewingResult(null)} className="px-8 py-2 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-900 transition shadow-lg">Tutup Hasil</button>
                  </div>
               </div>
             </div>
           )}
           
           {/* CHAT OVERLAY */}
           {showChat && (
              <div className="fixed bottom-4 right-4 z-50 w-96 h-[500px] shadow-2xl rounded-2xl animate-in slide-in-from-bottom-10 fade-in duration-300">
                 <ChatInterface onClose={() => setShowChat(false)} userName={currentUser.name} />
              </div>
           )}
        </div>
      </main>
    </div>
  );
};

export default App;