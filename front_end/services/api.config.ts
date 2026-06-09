// API Configuration for frontend communication

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, '') || '';

export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  
  // Auth endpoints
  AUTH: {
    LOGIN: '/api/v1/auth/login',
    REGISTER: '/api/v1/auth/register',
    REFRESH: '/api/v1/auth/refresh',
    LOGOUT: '/api/v1/auth/logout',
    ME: '/api/v1/auth/me',
  },
  
  // Tutor endpoints
  TUTOR: {
    LIST: '/api/v1/tutors',
    DETAIL: (id: number) => `/api/v1/tutors/${id}`,
    SEARCH: '/api/v1/tutors/search',
    CREATE: '/api/v1/tutors',
    UPDATE: (id: number) => `/api/v1/tutors/${id}`,
    DELETE: (id: number) => `/api/v1/tutors/${id}`,
  },
  
  // Course endpoints
  COURSES: {
    LIST: '/api/v1/courses',
    DETAIL: (id: number) => `/api/v1/courses/${id}`,
    CHAPTERS: (id: number) => `/api/v1/courses/${id}/chapters`,
    CHAPTER_DETAIL: (courseId: number, chapterId: number) => 
      `/api/v1/courses/${courseId}/chapters/${chapterId}`,
    MARK_COMPLETE: (id: number) => `/api/v1/courses/${id}/mark-complete`,
  },
  
  // Student endpoints
  STUDENTS: {
    PROFILE: '/api/v1/students/profile',
    PROGRESS: '/api/v1/students/progress',
    QUIZ_HISTORY: '/api/v1/students/quiz-history',
    SUBMIT_QUIZ: (quizId: number) => `/api/v1/students/submit-quiz/${quizId}`,
    LEARNING_FEEDBACK: '/api/v1/students/learning-feedback',
    ASK_TUTOR: '/api/v1/students/ask-tutor',
    CHAT_HISTORY: '/api/v1/students/chat-history',
  },
  
  // Teacher endpoints
  TEACHERS: {
    PROFILE: '/api/v1/teachers/profile',
    CLASSES: '/api/v1/teachers/classes',
    CLASS_ANALYTICS: (classId: number) => `/api/v1/teachers/class/${classId}/analytics`,
    CLASS_STUDENTS: (classId: number) => `/api/v1/teachers/class/${classId}/students`,
    GRADE_SUBMISSION: (classId: number, submissionId: number) => 
      `/api/v1/teachers/class/${classId}/grade-submission/${submissionId}`,
    TEACHING_INSIGHTS: '/api/v1/teachers/teaching-insights',
    TEACHING_ASSISTANT: '/api/v1/teachers/ask-teaching-assistant',
    DASHBOARD: '/api/v1/teachers/dashboard',
    CHAT_HISTORY: '/api/v1/teachers/chat-history',
  },
  
  // Agent endpoints
  AGENTS: {
    TUTOR_ASK: '/api/v1/agents/tutor/ask',
    GRADING_EVALUATE: '/api/v1/agents/grading/evaluate',
    QUIZ_GENERATE: '/api/v1/agents/quiz/generate',
    TEACHING_ANALYZE: '/api/v1/agents/teaching/analyze',
    STATUS: '/api/v1/agents/status',
  },
  
  // RAG endpoints
  RAG: {
    UPLOAD_DOCUMENT: '/api/v1/rag/upload-document',
    SEARCH: '/api/v1/rag/search',
    DOCUMENTS: '/api/v1/rag/documents',
    DELETE_DOCUMENT: (id: number) => `/api/v1/rag/documents/${id}`,
    BUILD_INDEX: '/api/v1/rag/build-index',
    INDEX_STATUS: '/api/v1/rag/index-status',
    RETRIEVE_CONTEXT: '/api/v1/rag/retrieve-context',
  },
};

export default API_CONFIG;
