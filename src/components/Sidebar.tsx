import React, { useRef } from 'react';
import { Grade, Category } from '../types';
import { Music, BookOpen, Mic2, Piano, MessageCircle, Upload, Wind, Keyboard, Camera, Sparkles, GraduationCap } from 'lucide-react';
import { cn } from '../lib/utils';

interface SidebarProps {
  selectedGrade: Grade;
  setSelectedGrade: (grade: Grade) => void;
  selectedCategory: Category;
  setSelectedCategory: (category: Category) => void;
  unreadCount?: number;
  teacherAvatar: string | null;
  setTeacherAvatar: (avatar: string | null) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  selectedGrade,
  setSelectedGrade,
  selectedCategory,
  setSelectedCategory,
  unreadCount = 0,
  teacherAvatar,
  setTeacherAvatar,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const grades: Grade[] = [1, 2, 3, 4, 5];
  
  const categories: { id: Category; label: string; icon: any; minGrade?: Grade; color: string }[] = [
    { id: 'hoc-hat', label: 'Học hát', icon: Mic2, color: 'bg-pink-500' },
    { id: 'doc-nhac', label: 'Đọc nhạc', icon: BookOpen, color: 'bg-orange-500' },
    { id: 'thuong-thuc', label: 'Thường thức', icon: Music, color: 'bg-purple-500' },
    { id: 'piano', label: 'Piano', icon: Piano, color: 'bg-indigo-500' },
    { id: 'recorder', label: 'Sáo Recorder', icon: Wind, minGrade: 4, color: 'bg-teal-500' },
    { id: 'ken-phim', label: 'Kèn phím', icon: Keyboard, minGrade: 4, color: 'bg-blue-500' },
    { id: 'hoi-dap', label: 'Hỏi đáp AI', icon: MessageCircle, color: 'bg-yellow-500' },
    { id: 'nop-bai', label: 'Nộp bài', icon: Upload, color: 'bg-green-500' },
  ];

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTeacherAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-72 bg-white border-r border-gray-100 h-screen flex flex-col overflow-y-auto shadow-2xl shadow-blue-50/50 z-10">
      {/* Teacher Profile Section */}
      <div className="p-8 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-blue-500 to-indigo-600 opacity-10 -skew-y-6 -translate-y-12"></div>
        
        <div className="relative inline-block group mb-4">
          <div className="w-24 h-24 rounded-3xl overflow-hidden border-4 border-white shadow-xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
            {teacherAvatar ? (
              <img src={teacherAvatar} alt="Teacher" className="w-full h-full object-cover" />
            ) : (
              <GraduationCap className="w-12 h-12 text-blue-400" />
            )}
          </div>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="absolute -bottom-2 -right-2 bg-white px-3 py-2 rounded-xl shadow-lg border border-gray-100 text-blue-600 hover:bg-blue-50 transition-all flex items-center gap-1"
            title="Thay đổi ảnh đại diện"
          >
            <Camera size={14} />
            <span className="text-[10px] font-black uppercase tracking-tight">Thay ảnh</span>
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleAvatarUpload} 
            accept="image/*" 
            className="hidden" 
          />
        </div>

        <h2 className="text-lg font-black text-gray-800 tracking-tight">Nguyễn Thị Thuý Hoa</h2>
        <div className="flex items-center justify-center gap-1 mt-1">
          <Sparkles size={12} className="text-yellow-500" />
          <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Giáo viên Âm nhạc</p>
        </div>
      </div>

      <div className="px-6 pb-8 space-y-8">
        {/* Grade Selection */}
        <div>
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-2 mb-3 block">Chọn Khối Lớp</label>
          <div className="grid grid-cols-5 gap-2">
            {grades.map((grade) => (
              <button
                key={grade}
                onClick={() => setSelectedGrade(grade)}
                className={cn(
                  "aspect-square rounded-2xl text-sm font-black transition-all flex items-center justify-center",
                  selectedGrade === grade
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                    : "bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                )}
              >
                {grade}
              </button>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div>
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-2 mb-3 block">Khám Phá Âm Nhạc</label>
          <div className="space-y-2">
            {categories.map((cat) => {
              if (cat.minGrade && selectedGrade < cat.minGrade) return null;
              
              const Icon = cat.icon;
              const isActive = selectedCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm font-bold transition-all group relative overflow-hidden",
                    isActive
                      ? "bg-blue-50 text-blue-700 shadow-sm"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                  )}
                >
                  {isActive && (
                    <div className="absolute left-0 top-0 w-1 h-full bg-blue-600"></div>
                  )}
                  <div className="flex items-center gap-3 relative z-10">
                    <div className={cn(
                      "p-2 rounded-xl transition-all",
                      isActive ? "bg-blue-600 text-white shadow-md shadow-blue-100" : "bg-gray-100 text-gray-400 group-hover:bg-white group-hover:shadow-sm"
                    )}>
                      <Icon size={18} />
                    </div>
                    {cat.label}
                  </div>
                  {cat.id === 'nop-bai' && unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-black relative z-10">
                      {unreadCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Decorative Music Notes */}
      <div className="mt-auto p-6 opacity-10 pointer-events-none select-none">
        <div className="flex justify-around">
          <Music size={24} />
          <Music size={20} />
          <Music size={28} />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
