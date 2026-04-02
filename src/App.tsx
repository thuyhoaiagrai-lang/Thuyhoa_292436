import { useState } from 'react';
import { Grade, Category } from './types';
import Sidebar from './components/Sidebar';
import LessonManager from './components/LessonManager';
import AIChat from './components/AIChat';
import SubmissionForm from './components/SubmissionForm';
import SubmissionList from './components/SubmissionList';
import { useMusicData } from './hooks/useMusicData';
import { UserCircle, GraduationCap, Music } from 'lucide-react';
import { cn } from './lib/utils';

export default function App() {
  const [selectedGrade, setSelectedGrade] = useState<Grade>(1);
  const [selectedCategory, setSelectedCategory] = useState<Category>('hoc-hat');
  const [isTeacherView, setIsTeacherView] = useState(false);
  const { lessons, setLessons, submissions, setSubmissions, teacherAvatar, setTeacherAvatar } = useMusicData();

  const renderContent = () => {
    if (selectedCategory === 'hoi-dap') {
      return <AIChat />;
    }
    
    if (selectedCategory === 'nop-bai') {
      return isTeacherView ? (
        <SubmissionList 
          submissions={submissions} 
          onUpdate={setSubmissions} 
        />
      ) : (
        <SubmissionForm 
          grade={selectedGrade} 
          submissions={submissions}
          onUpdateSubmissions={setSubmissions}
          onSubmitted={(sub) => setSubmissions([...submissions, sub])} 
        />
      );
    }

    return (
      <LessonManager 
        grade={selectedGrade} 
        category={selectedCategory} 
        lessons={lessons} 
        onSave={setLessons} 
      />
    );
  };

  const unreadCount = submissions.filter(s => s.status === 'graded' && !s.isRead).length;

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-gray-900 overflow-hidden">
      <Sidebar 
        selectedGrade={selectedGrade} 
        setSelectedGrade={setSelectedGrade}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        unreadCount={unreadCount}
        teacherAvatar={teacherAvatar}
        setTeacherAvatar={setTeacherAvatar}
      />

      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white border-b border-gray-50 px-10 flex items-center justify-between flex-shrink-0 shadow-sm relative z-10">
          <div className="flex items-center gap-6">
            <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-100">
              <Music className="w-6 h-6 text-white" />
            </div>
            <nav className="flex items-center text-sm font-black text-gray-400 uppercase tracking-widest">
              <span className="hover:text-blue-600 transition-colors cursor-default">Khối {selectedGrade}</span>
              <span className="mx-4 text-gray-200">/</span>
              <span className="text-gray-800 tracking-tight normal-case text-xl font-black">
                {selectedCategory === 'hoc-hat' && 'Học hát'}
                {selectedCategory === 'doc-nhac' && 'Đọc nhạc'}
                {selectedCategory === 'thuong-thuc' && 'Thường thức âm nhạc'}
                {selectedCategory === 'piano' && 'Nhạc cụ Piano'}
                {selectedCategory === 'recorder' && 'Sáo Recorder'}
                {selectedCategory === 'ken-phim' && 'Kèn phím'}
                {selectedCategory === 'hoi-dap' && 'Hỏi đáp AI'}
                {selectedCategory === 'nop-bai' && 'Nộp bài'}
              </span>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsTeacherView(!isTeacherView)}
              className={cn(
                "flex items-center gap-3 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-lg",
                isTeacherView 
                  ? "bg-purple-600 text-white shadow-purple-100 hover:bg-purple-700" 
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200 shadow-transparent"
              )}
            >
              {isTeacherView ? <GraduationCap size={18} /> : <UserCircle size={18} />}
              {isTeacherView ? "Chế độ Giáo viên" : "Chế độ Học sinh"}
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-5xl mx-auto h-full">
            {renderContent()}
          </div>
        </div>

        {/* Footer Info */}
        <footer className="h-10 bg-white border-t border-gray-100 px-8 flex items-center justify-between text-[10px] text-gray-400 font-medium flex-shrink-0">
          <div>© 2026 Âm nhạc Cánh Diều - Chương trình 2018</div>
          <div className="flex items-center gap-4">
            <span>Giáo viên: Nguyễn Thị Thuý Hoa</span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
              Đã lưu vào bộ nhớ trình duyệt
            </span>
          </div>
        </footer>
      </main>
    </div>
  );
}
