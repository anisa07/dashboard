const USER_KEY = "__dasboard_app_user_key";

export const getUserFromSessionStorage = () => {
    try {
        const userData = sessionStorage.getItem(USER_KEY);
        if (userData) {
            return JSON.parse(userData);
        }
    } catch (_) {
        throw new Error(`Error getting user data from storage`);
    }
}

interface UserData {
    accessToken: string,
    email: string,
    uid: string,
}

export const saveUserToSessionStorage = (userData: UserData) => {
    try {
        sessionStorage.setItem(USER_KEY, JSON.stringify(userData));
    } catch (_) {
        throw new Error(`Error setting user data to storage`);
    }
}

export const clearSessionStorage = () => {
    try {
        sessionStorage.clear();
    } catch (_) {
        throw new Error(`Error clearing storage`);
    }
}

