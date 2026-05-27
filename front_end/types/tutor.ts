/**
 * Tutor domain types for frontend API contracts.
 */

export interface Tutor {
  id: number;
  name: string;
  specialty: string;
  bio: string;
  rating: number;
  courses: string[];
  created_at: string;
}

export interface TutorCreatePayload {
  name: string;
  specialty: string;
  bio: string;
  courses: string[];
}

export interface TutorUpdatePayload {
  name?: string;
  specialty?: string;
  bio?: string;
  courses?: string[];
}

export interface TutorSearchParams {
  query: string;
  page?: number;
  page_size?: number;
}
