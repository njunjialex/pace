export interface User {
    id: number;
    username: string;
    email: string;
    role: 'tenant' | 'landlord' | 'relocator' | 'admin';
    first_name?: string;
    last_name?: string;
    phone_number?: string;
  }
  
  export interface LoginResponse {
    access: string;
    refresh: string;
    user: User;
  }