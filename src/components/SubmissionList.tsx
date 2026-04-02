import React from 'react';
import { Submission } from '../types';
import { CheckCircle, Clock, Video, MessageSquare, Star, Download, Trash2, Upload } from 'lucide-react';
import { cn } from '../lib/utils';

interface SubmissionListProps {
  submissions: Submission[];
  onUpdate: (submissions: Submission[]) => void;
}

const SubmissionList: React.FC<SubmissionListProps> = ({ submissions, onUpdate }) => {
  const [gradingId, setGradingId] = React.useState<string | null>(null);
  const [gradeValue, setGradeValue] = React.useState('');
  const [feedback, setFeedback] = React.useState('');

  const handleGrade = (id: string) => {
    if (!gradeValue || !feedback) return;
    const newSubmissions = submissions.map(s => 
      s.id === id ? { ...s, status: 'graded' as const, gradeValue, feedback, isRead: false } : s
    );
    onUpdate(newSubmissions);
    setGradingId(null);
    setGradeValue('');
    setFeedback('');
  };

  const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleDelete = (id: string) => {
    if (confirm('Cô có chắc muốn xoá bài nộp này?')) {
      onUpdate(submissions.filter(s => s.id !== id));
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div>
          <h2 className="text-2xl font-black text-gray-800 flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-100">
              <Upload size={20} />
            </div>
            Danh sách bài nộp của học sinh
          </h2>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1 ml-13">Dữ liệu được lưu tự động vào localStorage</p>
        </div>
      </div>
      
      {submissions.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-[2.5rem] border-2 border-dashed border-gray-100">
          <div className="w-20 h-20 bg-gray-50 text-gray-200 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
            <Video size={40} />
          </div>
          <h3 className="text-lg font-black text-gray-400">Chưa có bài nộp nào</h3>
          <p className="text-gray-300 text-sm mt-2">Khi học sinh nộp bài, danh sách sẽ xuất hiện tại đây.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {submissions.map((sub) => (
            <div key={sub.id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-blue-50/50 transition-all group relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <button 
                onClick={() => handleDelete(sub.id)}
                className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center bg-gray-50 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl opacity-0 group-hover:opacity-100 transition-all"
                title="Xoá bài nộp"
              >
                <Trash2 size={18} />
              </button>
              
              <div className="flex flex-wrap justify-between items-start gap-8">
                <div className="flex-1 min-w-[300px]">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-black text-xl">
                      {sub.studentName.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="font-black text-gray-800 text-2xl">{sub.studentName}</h3>
                        <span className="bg-blue-600 text-white text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest">Khối {sub.grade}</span>
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        {sub.status === 'graded' ? (
                          <span className="text-green-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                            <CheckCircle size={12} /> Đã chấm
                          </span>
                        ) : (
                          <span className="text-orange-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                            <Clock size={12} /> Chờ chấm
                          </span>
                        )}
                        <span className="text-gray-300 text-[10px] font-black uppercase tracking-widest">• {new Date(sub.createdAt).toLocaleDateString('vi-VN')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 mb-6 flex gap-3">
                    <MessageSquare size={18} className="text-gray-400 mt-1 flex-shrink-0" />
                    <p className="text-gray-600 text-sm font-medium italic leading-relaxed">
                      {sub.note ? `"${sub.note}"` : "Học sinh không để lại lời nhắn."}
                    </p>
                  </div>
                  
                  <div className="mb-6 rounded-3xl overflow-hidden bg-black aspect-video flex items-center justify-center border-4 border-gray-50 shadow-inner group/video relative">
                    {sub.videoUrl.startsWith('data:') ? (
                      <video 
                        src={sub.videoUrl} 
                        controls 
                        className="w-full h-full object-contain"
                      />
                    ) : getYoutubeId(sub.videoUrl) ? (
                      <iframe
                        src={`https://www.youtube.com/embed/${getYoutubeId(sub.videoUrl)}`}
                        className="w-full h-full"
                        allowFullScreen
                      />
                    ) : sub.videoUrl.includes('youtube.com') || sub.videoUrl.includes('youtu.be') ? (
                      <div className="text-white text-center p-8">
                        <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                          <Video size={40} className="text-white opacity-80" />
                        </div>
                        <p className="text-sm font-bold opacity-80">Video YouTube</p>
                        <a 
                          href={sub.videoUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="mt-4 inline-block bg-white text-black px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all"
                        >
                          Mở link xem video
                        </a>
                      </div>
                    ) : (
                      <div className="text-white text-center p-8">
                        <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                          <Video size={40} className="text-white opacity-80" />
                        </div>
                        <p className="text-sm font-bold opacity-80">Video từ link ngoài</p>
                        <a 
                          href={sub.videoUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="mt-4 inline-block bg-white text-black px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all"
                        >
                          Mở link xem video
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {sub.videoUrl.startsWith('data:') && (
                      <a 
                        href={sub.videoUrl} 
                        download={`video_${sub.studentName}_khoi${sub.grade}.mp4`}
                        className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
                      >
                        <Download size={16} /> Tải video về máy
                      </a>
                    )}
                  </div>
                </div>

                <div className="w-full md:w-80 bg-gray-50 p-6 rounded-[2rem] border border-gray-100 shadow-inner">
                  {sub.status === 'graded' && gradingId !== sub.id ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Kết quả chấm:</span>
                        <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-md shadow-blue-100">
                          {sub.gradeValue}
                        </div>
                      </div>
                      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                        <p className="text-sm text-gray-600 font-bold italic leading-relaxed">"{sub.feedback}"</p>
                      </div>
                      <button 
                        onClick={() => {
                          setGradingId(sub.id);
                          setGradeValue(sub.gradeValue || '');
                          setFeedback(sub.feedback || '');
                        }}
                        className="w-full py-3 text-xs font-black text-blue-600 hover:bg-blue-50 rounded-xl transition-all uppercase tracking-widest"
                      >
                        Sửa lại nhận xét
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-yellow-100 text-yellow-600 rounded-xl flex items-center justify-center">
                          <Star size={16} className="fill-current" />
                        </div>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Chấm điểm bài làm</span>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Mức độ hoàn thành</label>
                          <select 
                            className="w-full bg-white border-2 border-gray-100 rounded-2xl px-4 py-3 text-sm font-bold text-gray-700 outline-none focus:border-blue-500 transition-all"
                            value={gradeValue}
                            onChange={(e) => setGradeValue(e.target.value)}
                          >
                            <option value="" disabled>Chọn mức độ</option>
                            <option value="Hoàn thành tốt">Hoàn thành tốt</option>
                            <option value="Hoàn thành">Hoàn thành</option>
                            <option value="Cần cố gắng">Cần cố gắng</option>
                          </select>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nhận xét của cô</label>
                          <textarea 
                            className="w-full bg-white border-2 border-gray-100 rounded-2xl px-4 py-3 text-sm font-medium text-gray-600 outline-none focus:border-blue-500 transition-all h-32 resize-none leading-relaxed"
                            placeholder="Nhập nhận xét chi tiết cho em..."
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                          />
                        </div>
                        
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleGrade(sub.id)}
                            disabled={!gradeValue || !feedback}
                            className="flex-1 bg-blue-600 text-white py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 disabled:opacity-50 transition-all shadow-lg shadow-blue-100"
                          >
                            Lưu kết quả
                          </button>
                          {gradingId === sub.id && (
                            <button 
                              onClick={() => setGradingId(null)}
                              className="px-4 py-4 bg-gray-200 text-gray-600 rounded-2xl text-xs font-black uppercase tracking-widest"
                            >
                              Huỷ
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SubmissionList;
