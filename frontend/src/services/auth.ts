import config from "../config/config";
import {UserInfoType} from "../types/user-info.type";

export class Auth {
    public static accessTokenKey = 'accessToken';
    public static refreshTokenKey = 'refreshToken';
    public static userInfoKey = 'userInfo';

    public static async processUnauthorizedResponse(): Promise<boolean> {
        const refreshToken: string | null = localStorage.getItem(this.refreshTokenKey);
        if (refreshToken) {
            const response = await fetch(config.host + '/refresh', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({refreshToken: refreshToken})
            });

            if (response && response.status === 200) {
                const result = await response.json();
                if (result && !result.error) {
                    this.setTokens(result.tokens.accessToken, result.tokens.refreshToken);
                    return true;
                }
            }
        }

        this.removeTokens();
        location.href = '#/'
        return false;
    }

    public static async logOut(): Promise<void> {
        const refreshToken = localStorage.getItem(this.refreshTokenKey);
        const response = await fetch(config.host + '/logout', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({refreshToken: refreshToken })
        });

        if (response && response.status === 200) {
            const result = await response.json();
            if (result && !result.error) {
                Auth.removeTokens();
                localStorage.removeItem(Auth.userInfoKey);
                return;
            }
        }
    }

    public static setTokens(accessToken: string, refreshToken: string): void {
        localStorage.setItem(this.accessTokenKey, accessToken);
        localStorage.setItem(this.refreshTokenKey, refreshToken);
    }

    public static removeTokens(): void {
        localStorage.removeItem(this.accessTokenKey);
        localStorage.removeItem(this.refreshTokenKey);
    }

    public static setUserInfo(info: UserInfoType): void {
        localStorage.setItem(this.userInfoKey, JSON.stringify(info));
    }

    public static getUserInfo()  {
        const userInfo: string | null = localStorage.getItem(this.userInfoKey);

        if (userInfo) {
            return JSON.parse(userInfo);
        }

        return null;
    }
}