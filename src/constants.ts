import { Lesson } from './types';
import { v4 as uuidv4 } from 'uuid';

export const INITIAL_LESSONS: Lesson[] = [
  {
    id: uuidv4(),
    grade: 1,
    category: 'hoc-hat',
    title: 'Khám phá âm thanh',
    content: 'Học hát bài "Tiếng trống trường em". Chú ý nhịp điệu và lời ca vui tươi.',
    createdAt: Date.now(),
  },
  {
    id: uuidv4(),
    grade: 4,
    category: 'recorder',
    title: 'Làm quen với sáo Recorder',
    content: 'Cách cầm sáo và thổi nốt Si (B).',
    createdAt: Date.now(),
  },
  {
    id: uuidv4(),
    grade: 5,
    category: 'ken-phim',
    title: 'Luyện ngón kèn phím',
    content: 'Bài tập luyện ngón 1-2-3-4-5 trên kèn phím.',
    createdAt: Date.now(),
  }
];

export const CATEGORY_LABELS: Record<string, string> = {
  'hoc-hat': 'Học hát',
  'doc-nhac': 'Đọc nhạc',
  'thuong-thuc': 'Thường thức âm nhạc',
  'piano': 'Nhạc cụ Piano',
  'recorder': 'Sáo Recorder',
  'ken-phim': 'Kèn phím',
  'hoi-dap': 'Hỏi đáp AI',
  'nop-bai': 'Nộp bài video'
};
