export interface User {
    id: string;
    role: 'ADMIN' | 'CUSTOMER';
}

export interface Sweet {
    _id: string;
    name: string;
    category: string;
    price: number;
    quantity: number;
}

export interface AuthState {
    token: string | null;
    user: User | null;
    isAuthenticated: boolean;
}
