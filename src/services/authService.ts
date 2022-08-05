
// TODO implement logic
import {saveUserToSessionStorage} from "./sessionService";

export const login = async (userData: any) => {
    saveUserToSessionStorage({email: userData.email, token: 'OK'});
    return Promise.resolve(true);
}

export const signup = async (userData: any) => {
    return Promise.resolve(true);
}
