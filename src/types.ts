export type Grade = 1 | 2 | 3 | 4 | 5;

export type Category = 
  | 'hoc-hat' 
  | 'doc-nhac' 
  | 'thuong-thuc' 
  | 'piano' 
  | 'recorder' 
  | 'ken-phim' 
  | 'hoi-dap' 
  | 'nop-bai';

export interface Lesson {
  id: string;
  grade: Grade;
  category: Category;
  title: string;
  content: string;
  mediaUrl?: string;
  mediaType?: 'video' | 'audio' | 'image';
  createdAt: number;
}

export interface Submission {
  id: string;
  studentName: string;
  grade: Grade;
  videoUrl: string;
  note: string;
  status: 'pending' | 'graded';
  gradeValue?: string;
  feedback?: string;
  isRead?: boolean;
  createdAt: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
