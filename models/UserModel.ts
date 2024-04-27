export interface newUser {
    name: string;
    age: number;
    email: string;
    password: string;
}
export interface UserId {
    id: number;
}

export type User = newUser & UserId;