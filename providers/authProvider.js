import { fetchJson } from "@shared/utils/httpUtil";
import { apiUrl } from "@shared/providers/constantsProvider";

const authProvider = {
    login: async ({ username, password }) => {
        try {
            const response = await fetchJson(apiUrl + '/auth/login', {
                method: 'POST',
                body: JSON.stringify({ username, password }),
                headers: new Headers({ 'Content-Type': 'application/json' }),
            });
            if (response.status < 200 || response.status >= 300) {
                throw new Error(response.statusText);
            }
            await authProvider.getIdentity(true);
        } catch (error) {
            console.log(error);
            const errorMessage = error.body?.message ?? 'Network error';
            throw new Error(errorMessage);
        }
    },
    register: async ({ username, password }) => {
        try {
            const response = await fetchJson(apiUrl + '/auth/register', {
                method: 'POST',
                body: JSON.stringify({ username, password }),
                headers: new Headers({ 'Content-Type': 'application/json' }),
            });
            if (response.status < 200 || response.status >= 300) {
                throw new Error(response.statusText);
            }
            await authProvider.getIdentity(true);
        } catch (error) {
            console.log(error);
            const errorMessage = error.body?.message ?? 'Network error';
            throw new Error(errorMessage);
        }
    },
    logout: async () => {
        await fetchJson(apiUrl + '/auth/logout', { method: 'POST' });
        localStorage.removeItem('auth');
    },
    checkAuth: ({ force = false }) => {
        if (isPublicRoute() && !force) {
            return Promise.resolve('guest');
        }
        return localStorage.getItem('auth') ? Promise.resolve() : Promise.reject();
    },
    checkError: async (error) => {
        const status = error.status;
        if (status === 401 || status === 403) {
            await authProvider.logout();
            return Promise.reject();
        }
        // other error code (404, 500, etc): no need to log out
        return Promise.resolve();
    },
    getIdentity: async (force = false) => {
        const auth = localStorage.getItem('auth');
        if (!force && auth) {
            try {
                return JSON.parse(auth);
            } catch { }
        }

        const response = await fetchJson(apiUrl + '/profile', { method: 'GET' });
        const { name, permissions } = response.json;
        const identity = ({ fullName: name, permissions });
        localStorage.setItem('auth', JSON.stringify(identity))
        return identity;
    },
    getPermissions: async () => {
        if (isPublicRoute()) {
            return { guest: true };
        }
        const { permissions } = await authProvider.getIdentity();
        return permissions;
    },
};

function isPublicRoute() {
    return location.pathname === '/register';
}

export default authProvider;
