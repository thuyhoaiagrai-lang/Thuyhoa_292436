import React, { useState } from 'react';
import { Grade, Lesson, Category } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { Plus, Save, Trash2, Edit2, X, Check, AlertCircle, BookOpen, Music, Clock, Calendar, Video, Youtube, Link, Upload } from 'lucide-react';
import { cn } from '../lib/utils';

interface LessonManagerProps {
  grade: Grade;
  category: Category;
  lessons: Lesson[];
  onSave: (lessons: Lesson[]) => void;
}

const LessonManager: React.FC<LessonManagerProps> = ({ grade, category, lessons, onSave }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Lesson>>({});
  const [isAdding, setIsAdding] = useState(false);
  const [autoSave, setAutoSave] = useState(true);

  const filteredLessons = lessons.filter(l => l.grade === grade && l.category === category);

  const handleEdit = (lesson: Lesson) => {
    setEditingId(lesson.id);
    setEditForm(lesson);
  };

  const handleDelete = (id: string) => {
    if (confirm('Cô có chắc chắn muốn xoá nội dung này?')) {
      const newLessons = lessons.filter(l => l.id !== id);
      onSave(newLessons);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm.title || !editForm.content) return;

    let newLessons: Lesson[];
    if (editingId) {
      newLessons = lessons.map(l => l.id === editingId ? { ...l, ...editForm } as Lesson : l);
    } else {
      const newLesson: Lesson = {
        id: uuidv4(),
        grade,
        category,
        title: editForm.title || '',
        content: editForm.content || '',
        mediaUrl: editForm.mediaUrl,
        mediaType: editForm.mediaType,
        createdAt: Date.now(),
      };
      newLessons = [...lessons, newLesson];
    }

    onSave(newLessons);
    setEditingId(null);
    setIsAdding(false);
    setEditForm({});
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 20 * 1024 * 1024) { // 20MB limit for localStorage
        alert('Video quá lớn! Cô vui lòng chọn video dưới 20MB hoặc dán link YouTube nhé.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditForm({ ...editForm, mediaUrl: reader.result as string, mediaType: 'video' });
      };
      reader.readAsDataURL(file);
    }
  };

  const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div>
          <h2 className="text-2xl font-black text-gray-800 flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-100">
              <BookOpen size={20} />
            </div>
            Nội dung bài học - Khối {grade}
          </h2>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1 ml-13">Chương trình âm nhạc 2018</p>
        </div>
        
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-xs font-bold text-gray-400 cursor-pointer hover:text-gray-600 transition-colors">
            <div className={cn(
              "w-10 h-6 rounded-full transition-all relative",
              autoSave ? "bg-green-500" : "bg-gray-200"
            )}>
              <input 
                type="checkbox" 
                checked={autoSave} 
                onChange={(e) => setAutoSave(e.target.checked)}
                className="hidden"
              />
              <div className={cn(
                "absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm",
                autoSave ? "left-5" : "left-1"
              )}></div>
            </div>
            Lưu tự động
          </label>
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl text-sm font-black hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
          >
            <Plus size={18} />
            Thêm bài học
          </button>
        </div>
      </div>

      {(isAdding || editingId) && (
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[2rem] border-4 border-blue-50 shadow-xl space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                <Edit2 size={16} />
              </div>
              <h3 className="font-black text-gray-800 text-lg">{editingId ? 'Sửa bài học' : 'Thêm bài học mới'}</h3>
            </div>
            <button type="button" onClick={() => { setIsAdding(false); setEditingId(null); }} className="w-10 h-10 flex items-center justify-center bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
              <X size={20} />
            </button>
          </div>
          
          <div className="space-y-5">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Tiêu đề bài học</label>
              <input
                type="text"
                value={editForm.title || ''}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-5 py-4 focus:border-blue-500 focus:bg-white outline-none transition-all font-bold text-gray-700"
                placeholder="Ví dụ: Bài 1: Em yêu âm nhạc..."
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Nội dung chi tiết</label>
              <textarea
                value={editForm.content || ''}
                onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-5 py-4 h-48 focus:border-blue-500 focus:bg-white outline-none transition-all font-medium text-gray-600 leading-relaxed resize-none"
                placeholder="Nhập nội dung bài học tại đây..."
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Link YouTube</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-red-500">
                    <Youtube size={18} />
                  </div>
                  <input
                    type="text"
                    value={editForm.mediaType === 'video' && !editForm.mediaUrl?.startsWith('data:') ? editForm.mediaUrl : ''}
                    onChange={(e) => setEditForm({ ...editForm, mediaUrl: e.target.value, mediaType: 'video' })}
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl pl-12 pr-5 py-4 focus:border-blue-500 focus:bg-white outline-none transition-all font-bold text-gray-700 text-sm"
                    placeholder="Dán link YouTube tại đây..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Hoặc tải video lên</label>
                <label className="flex items-center gap-3 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl px-5 py-4 cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-all group">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-gray-400 group-hover:text-blue-500 shadow-sm transition-colors">
                    <Upload size={18} />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-bold text-gray-600 truncate">
                      {editForm.mediaUrl?.startsWith('data:') ? 'Đã chọn video' : 'Chọn file video (Dưới 20MB)'}
                    </p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">MP4, MOV, WebM</p>
                  </div>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {editForm.mediaUrl && (
              <div className="relative rounded-2xl overflow-hidden border-2 border-blue-100 bg-black aspect-video group">
                {getYoutubeId(editForm.mediaUrl) ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${getYoutubeId(editForm.mediaUrl)}`}
                    className="w-full h-full"
                    allowFullScreen
                  />
                ) : (
                  <video src={editForm.mediaUrl} className="w-full h-full" controls />
                )}
                <button
                  type="button"
                  onClick={() => setEditForm({ ...editForm, mediaUrl: undefined, mediaType: undefined })}
                  className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>
          
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => { setIsAdding(false); setEditingId(null); }}
              className="px-8 py-4 rounded-2xl font-black text-gray-400 hover:bg-gray-50 transition-all"
            >
              Huỷ bỏ
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 bg-blue-600 text-white px-10 py-4 rounded-2xl font-black hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all"
            >
              <Save size={20} />
              Lưu bài học
            </button>
          </div>
        </form>
      )}

      <div className="grid gap-6">
        {filteredLessons.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[2.5rem] border-2 border-dashed border-gray-100">
            <div className="w-20 h-20 bg-gray-50 text-gray-200 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
              <Music size={40} />
            </div>
            <h3 className="text-lg font-black text-gray-400">Chưa có bài học nào</h3>
            <p className="text-gray-300 text-sm mt-2">Cô hãy nhấn nút "Thêm bài học" để bắt đầu nhé!</p>
          </div>
        ) : (
          filteredLessons.map((lesson) => (
            <div key={lesson.id} className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-blue-50/50 transition-all group relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="flex justify-between items-start gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-black text-xs">
                      {new Date(lesson.createdAt).getDate()}/{new Date(lesson.createdAt).getMonth() + 1}
                    </div>
                    <h4 className="font-black text-gray-800 text-xl leading-tight">{lesson.title}</h4>
                  </div>
                  <p className="text-gray-500 text-base whitespace-pre-wrap leading-relaxed font-medium">{lesson.content}</p>
                  
                  {lesson.mediaUrl && (
                    <div className="mt-6 rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-black aspect-video max-w-2xl">
                      {getYoutubeId(lesson.mediaUrl) ? (
                        <iframe
                          src={`https://www.youtube.com/embed/${getYoutubeId(lesson.mediaUrl)}`}
                          className="w-full h-full"
                          allowFullScreen
                        />
                      ) : (
                        <video src={lesson.mediaUrl} className="w-full h-full" controls />
                      )}
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                  <button
                    onClick={() => handleEdit(lesson)}
                    className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                    title="Sửa bài học"
                  >
                    <Edit2 size={20} />
                  </button>
                  <button
                    onClick={() => handleDelete(lesson.id)}
                    className="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm"
                    title="Xoá bài học"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-50 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Đã lưu tự động</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Cập nhật: {new Date(lesson.createdAt).toLocaleDateString('vi-VN')}</span>
                  <span className="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">Khối {lesson.grade}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LessonManager;
