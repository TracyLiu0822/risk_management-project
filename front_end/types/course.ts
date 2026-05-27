/**
 * 课程相关的类型定义
 * 用于页面和服务层的数据结构约束
 */

/** 课程章节类型 */
export interface CourseSection {
  id: string;
  title: string;
  slug: string;
  content: string; // Markdown 格式内容
  children?: CourseSection[];
  order: number;
}

/** 完整课程数据结构 */
export interface Course {
  id: string;
  title: string;
  description: string;
  sections: CourseSection[];
}

/** 课程服务的响应类型 */
export interface GetCourseSectionResponse {
  success: boolean;
  data: CourseSection;
  error?: string;
}

export interface GetCourseResponse {
  success: boolean;
  data: Course;
  error?: string;
}
