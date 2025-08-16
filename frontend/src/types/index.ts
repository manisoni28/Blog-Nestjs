export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface Blog {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  author: User;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}
