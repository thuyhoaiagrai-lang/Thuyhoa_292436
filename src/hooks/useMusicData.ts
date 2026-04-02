import { useState, useEffect } from 'react';
import { Lesson, Submission } from '../types';
import { INITIAL_LESSONS } from '../constants';

export function useMusicData() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [teacherAvatar, setTeacherAvatar] = useState<string | null>(null);

  useEffect(() => {
    const savedLessons = localStorage.getItem('music_lessons');
    const savedSubmissions = localStorage.getItem('music_submissions');
    const savedAvatar = localStorage.getItem('teacher_avatar');

    if (savedLessons) {
      setLessons(JSON.parse(savedLessons));
    } else {
      setLessons(INITIAL_LESSONS);
      localStorage.setItem('music_lessons', JSON.stringify(INITIAL_LESSONS));
    }

    if (savedSubmissions) {
      setSubmissions(JSON.parse(savedSubmissions));
    }

    if (savedAvatar) {
      setTeacherAvatar(savedAvatar);
    }
  }, []);

  const saveLessons = (newLessons: Lesson[]) => {
    setLessons(newLessons);
    localStorage.setItem('music_lessons', JSON.stringify(newLessons));
  };

  const saveSubmissions = (newSubmissions: Submission[]) => {
    setSubmissions(newSubmissions);
    localStorage.setItem('music_submissions', JSON.stringify(newSubmissions));
  };

  const saveAvatar = (newAvatar: string | null) => {
    setTeacherAvatar(newAvatar);
    if (newAvatar) {
      localStorage.setItem('teacher_avatar', newAvatar);
    } else {
      localStorage.removeItem('teacher_avatar');
    }
  };

  return {
    lessons,
    setLessons: saveLessons,
    submissions,
    setSubmissions: saveSubmissions,
    teacherAvatar,
    setTeacherAvatar: saveAvatar,
  };
}
