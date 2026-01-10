export interface Project {
    title: string;
    desc: string;
    link: string;
  }
  
  export interface ProfileContent {
    name: string;
    tagline: string;
    manifesto: string; // The "Bio"
    avatar?: string;
    arsenal: string[]; // Skills
    masterpieces: Project[]; // Projects
  }
  
  export interface UserProfile {
    id: number;
    user_id: string;
    slug: string;
    is_public: boolean;
    active_template_id: number;
    data: ProfileContent;
  }
  
  export interface Template {
    id: number;
    name: string;
    code: string; // e.g. 'glass_v1'
    thumbnail_url?: string;
  }