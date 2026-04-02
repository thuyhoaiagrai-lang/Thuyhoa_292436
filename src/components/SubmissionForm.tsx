import React, { useState, useRef } from 'react';
import { Grade, Submission } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { Upload, Video, Send, CheckCircle, FileVideo, AlertTriangle, Search, Star, MessageSquare, Clock } from 'lucide-react';
import { cn } from '../lib/utils';

interface SubmissionFormProps {
  grade: Grade;
  submissions: Submission[];
  onUpdateSubmissions: (submissions: Submission[]) => void;
  onSubmitted: (submission: Submission) => void;
}

const SubmissionForm: React.FC<SubmissionFormProps> = ({ grade, submissions, onUpdateSubmissions, onSubmitted }) => {
  const [activeTab, setActiveTab] = useState<'submit' | 'results'>('submit');
  const [form, setForm] = useState({ studentName: '', videoUrl: '', note: '' });
  const [isSuccess, setIsSuccess] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [searchName, setSearchName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 4 * 1024 * 1024) {
      setUploadError('Dung lượng video quá lớn (tối đa 4MB để lưu vào bộ nhớ trình duyệt). Em hãy gửi link YouTube thay thế nhé!');
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm({ ...form, videoUrl: reader.result as string });
      setIsUploading(false);
    };
    reader.onerror = () => {
      setUploadError('Có lỗi khi đọc file video.');
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.videoUrl) {
      setUploadError('Vui lòng tải lên video hoặc dán link video.');
      return;
    }

    const newSubmission: Submission = {
      id: uuidv4(),
      studentName: form.studentName,
      grade,
      videoUrl: form.videoUrl,
      note: form.note,
      status: 'pending',
      isRead: false,
      createdAt: Date.now(),
    };
    onSubmitted(newSubmission);
    setIsSuccess(true);
    setForm({ studentName: '', videoUrl: '', note: '' });
    setTimeout(() => setIsSuccess(false), 3000);
  };

  const filteredResults = submissions.filter(s => 
    s.studentName.toLowerCase().includes(searchName.toLowerCase()) && searchName.length > 1
  );

  const handleMarkAsRead = (id: string) => {
    const sub = submissions.find(s => s.id === id);
    if (sub && !sub.isRead && sub.status === 'graded') {
      const newSubmissions = submissions.map(s => 
        s.id === id ? { ...s, isRead: true } : s
      );
      onUpdateSubmissions(newSubmissions);
    }
  };

  const unreadCount = submissions.filter(s => s.status === 'graded' && !s.isRead).length;

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-[2.5rem] border border-gray-100 shadow-xl overflow-hidden">
      <div className="flex border-b border-gray-50">
        <button
          onClick={() => setActiveTab('submit')}
          className={cn(
            "flex-1 py-6 text-sm font-black uppercase tracking-widest transition-all relative",
            activeTab === 'submit' ? "text-blue-600 bg-blue-50/30" : "text-gray-400 hover:text-gray-600"
          )}
        >
          {activeTab === 'submit' && <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-600"></div>}
          Nộp bài tập
        </button>
        <button
          onClick={() => setActiveTab('results')}
          className={cn(
            "flex-1 py-6 text-sm font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 relative",
            activeTab === 'results' ? "text-blue-600 bg-blue-50/30" : "text-gray-400 hover:text-gray-600"
          )}
        >
          {activeTab === 'results' && <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-600"></div>}
          Tra cứu kết quả
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-black">
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      <div className="p-10">
        {activeTab === 'submit' ? (
          <>
            <div className="text-center mb-10">
              <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-50">
                <Video size={36} />
              </div>
              <h2 className="text-3xl font-black text-gray-800 tracking-tight">Nộp bài tập Video</h2>
              <p className="text-gray-400 mt-2 font-medium">Em hãy quay video thực hành và gửi cho cô Thuý Hoa chấm nhé!</p>
            </div>

            {isSuccess ? (
              <div className="bg-green-50 border-2 border-green-100 p-10 rounded-[2.5rem] text-center space-y-4">
                <div className="w-20 h-20 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto shadow-lg shadow-green-100">
                  <CheckCircle size={40} />
                </div>
                <h3 className="text-2xl font-black text-green-800">Nộp bài thành công!</h3>
                <p className="text-green-600 font-bold">Cô sẽ sớm xem và nhận xét bài của em. Giỏi lắm!</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Họ và tên học sinh</label>
                    <input
                      type="text"
                      required
                      value={form.studentName}
                      onChange={(e) => setForm({ ...form, studentName: e.target.value })}
                      className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-5 py-4 focus:border-blue-500 focus:bg-white outline-none transition-all font-bold text-gray-700"
                      placeholder="Ví dụ: Nguyễn Văn A"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Khối lớp</label>
                    <div className="w-full bg-blue-50 border-2 border-blue-100 rounded-2xl px-5 py-4 text-blue-600 font-black">
                      Khối {grade}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Tải video lên hoặc dán link</label>
                  
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className={cn(
                          "w-full h-full min-h-[140px] border-4 border-dashed rounded-3xl flex flex-col items-center justify-center gap-3 transition-all",
                          form.videoUrl.startsWith('data:') 
                            ? "border-green-300 bg-green-50 text-green-600" 
                            : "border-gray-100 bg-gray-50 text-gray-400 hover:border-blue-300 hover:bg-blue-50"
                        )}
                      >
                        {isUploading ? (
                          <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-blue-600"></div>
                        ) : form.videoUrl.startsWith('data:') ? (
                          <>
                            <CheckCircle size={32} />
                            <span className="text-sm font-black">Đã tải video lên</span>
                          </>
                        ) : (
                          <>
                            <FileVideo size={32} />
                            <span className="text-xs font-black uppercase tracking-wider">Chọn file video</span>
                          </>
                        )}
                      </button>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="video/*"
                        className="hidden"
                      />
                    </div>

                    <div className="flex-[2] flex flex-col justify-center">
                      <div className="relative">
                        <Upload className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6" />
                        <input
                          type="url"
                          value={form.videoUrl.startsWith('data:') ? '' : form.videoUrl}
                          onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
                          className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl pl-14 pr-5 py-4 focus:border-blue-500 focus:bg-white outline-none transition-all font-bold text-gray-700"
                          placeholder="Hoặc dán link YouTube/Drive..."
                          disabled={form.videoUrl.startsWith('data:')}
                        />
                      </div>
                      
                      {form.videoUrl && !form.videoUrl.startsWith('data:') && getYoutubeId(form.videoUrl) && (
                        <div className="mt-4 rounded-2xl overflow-hidden border-2 border-blue-100 bg-black aspect-video shadow-lg">
                          <iframe
                            src={`https://www.youtube.com/embed/${getYoutubeId(form.videoUrl)}`}
                            className="w-full h-full"
                            allowFullScreen
                          />
                        </div>
                      )}

                      {form.videoUrl.startsWith('data:') && (
                        <button 
                          type="button" 
                          onClick={() => setForm({ ...form, videoUrl: '' })}
                          className="text-xs font-bold text-red-500 mt-2 hover:underline text-left ml-1"
                        >
                          Xoá video đã tải lên để dùng link
                        </button>
                      )}
                    </div>
                  </div>

                  {uploadError && (
                    <div className="flex items-center gap-3 text-red-500 text-xs font-bold bg-red-50 p-4 rounded-2xl border border-red-100">
                      <AlertTriangle size={18} />
                      {uploadError}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Lời nhắn cho cô</label>
                  <textarea
                    value={form.note}
                    onChange={(e) => setForm({ ...form, note: e.target.value })}
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-5 py-4 h-32 focus:border-blue-500 focus:bg-white outline-none transition-all font-medium text-gray-600 resize-none"
                    placeholder="Em gặp khó khăn gì khi thực hành không? Hãy nhắn cho cô nhé!"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isUploading}
                  className="w-full bg-blue-600 text-white py-5 rounded-[2rem] font-black text-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-100 disabled:opacity-50"
                >
                  <Send size={24} />
                  Gửi bài cho cô ngay
                </button>
              </form>
            )}
          </>
        ) : (
          <div className="space-y-8">
            <div className="text-center mb-10">
              <div className="w-20 h-20 bg-purple-100 text-purple-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-lg shadow-purple-50">
                <Search size={36} />
              </div>
              <h2 className="text-3xl font-black text-gray-800 tracking-tight">Tra cứu kết quả học tập</h2>
              <p className="text-gray-400 mt-2 font-medium">Em hãy nhập tên để xem cô đã chấm bài chưa nhé!</p>
            </div>

            <div className="relative">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6" />
              <input
                type="text"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className="w-full bg-gray-50 border-2 border-gray-100 rounded-[2rem] pl-16 pr-6 py-5 focus:border-purple-500 focus:bg-white outline-none transition-all font-bold text-gray-700 text-lg shadow-sm"
                placeholder="Nhập họ và tên của em..."
              />
            </div>

            <div className="space-y-6 mt-10">
              {searchName.length > 1 ? (
                filteredResults.length > 0 ? (
                  filteredResults.map(res => (
                    <div 
                      key={res.id} 
                      onMouseEnter={() => handleMarkAsRead(res.id)}
                      className={cn(
                        "bg-white p-8 rounded-[2.5rem] border transition-all space-y-6 relative overflow-hidden",
                        res.status === 'graded' && !res.isRead ? "border-blue-200 bg-blue-50/30 shadow-xl shadow-blue-50" : "border-gray-100 shadow-sm"
                      )}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center font-black text-gray-400">
                            {res.studentName.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-3">
                              <h4 className="font-black text-gray-800 text-xl">{res.studentName}</h4>
                              {res.status === 'graded' && !res.isRead && (
                                <span className="bg-blue-600 text-white text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest">MỚI</span>
                              )}
                            </div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Khối {res.grade} • {new Date(res.createdAt).toLocaleDateString('vi-VN')}</p>
                          </div>
                        </div>
                        {res.status === 'graded' ? (
                          <div className="bg-green-500 text-white px-4 py-2 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-green-100">
                            <CheckCircle size={14} /> Đã chấm điểm
                          </div>
                        ) : (
                          <div className="bg-orange-500 text-white px-4 py-2 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-orange-100">
                            <Clock size={14} /> Chờ cô chấm
                          </div>
                        )}
                      </div>

                      {res.status === 'graded' && (
                        <div className="bg-white p-6 rounded-3xl border-2 border-blue-50 space-y-4 shadow-inner">
                          <div className="flex items-center gap-3 text-blue-600">
                            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                              <Star size={20} className="fill-current" />
                            </div>
                            <span className="font-black text-lg uppercase tracking-tight">Kết quả: {res.gradeValue}</span>
                          </div>
                          <div className="flex gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                              <MessageSquare size={18} className="text-gray-400" />
                            </div>
                            <p className="text-gray-600 font-bold italic leading-relaxed">"{res.feedback}"</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-20 bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-100">
                    <div className="w-20 h-20 bg-white text-gray-200 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                      <Search size={40} />
                    </div>
                    <h3 className="text-lg font-black text-gray-400">Không tìm thấy bài nộp nào</h3>
                    <p className="text-gray-300 text-sm mt-2">Em hãy kiểm tra lại tên của mình nhé!</p>
                  </div>
                )
              ) : (
                <div className="text-center py-20 text-gray-300 italic font-bold">
                  <p>Nhập ít nhất 2 ký tự để tìm kiếm bài của em...</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubmissionForm;
