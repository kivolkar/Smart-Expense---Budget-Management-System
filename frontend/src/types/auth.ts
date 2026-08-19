export interface User {
  _id: string;
  name: string;
  email: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  _id: string;
  name: string;
  email: string;
  accessToken: string;
}
