import { nanoid } from 'nanoid';

export function getUserId(): string {
    let userId = localStorage.getItem("userId");
    if (!userId) {
        userId = nanoid(); // Genera un ID único seguro y compatible
        localStorage.setItem("userId", userId);
    }
    return userId;
}

export const resetUserSession = () => {
    localStorage.removeItem("userId");
};
