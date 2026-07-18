import { fetchJson } from "@shared/utils/httpUtil";
import { apiUrl } from "@shared/providers/constantsProvider";

const maintenanceResponse = {
    message: false,
    logoutUser: false,
    redirectTo: '/maintenance',
};

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
    register: async ({ username, password, userInfo }) => {
        try {
            const response = await fetchJson(apiUrl + '/auth/register', {
                method: 'POST',
                body: JSON.stringify({ username, password, userInfo }),
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
        try {
            const identity = await authProvider.getIdentity();
            if (identity.impersonated) {
                await fetchJson(apiUrl + '/auth/unimpersonate', { method: 'POST' });
                await authProvider.getIdentity(true);
                return;
            }
        } catch { }
        try {
            await fetchJson(apiUrl + '/auth/logout', { method: 'POST', keepalive: true });
        } catch { }
        localStorage.removeItem('auth');
    },
    checkAuth: async ({ force = false }) => {
        if (isPublicRoute() && !force) {
            return Promise.resolve('guest');
        }
        if (!localStorage.getItem('auth')) {
            return Promise.reject();
        }
        // localStorage.auth never expires on its own, so its mere presence doesn't
        // mean the session is still valid server-side (e.g. a JWT from a week ago).
        // react-admin's own <Login> page calls checkAuth on mount to decide whether
        // to redirect an "already logged in" visitor away from the login form back
        // to "/" - trusting the stale cache here would bounce a genuinely logged-out
        // returning user away from the login form on every attempt, with no way to
        // ever reach it. Validate for real instead of trusting the cache.
        try {
            await authProvider.getIdentity(true);
            return Promise.resolve();
        } catch {
            return Promise.reject();
        }
    },
    checkError: async (error) => {
        const status = error.status;
        
        // Check for maintenance mode (503 Service Unavailable)
        if (status === 503) {
            // Store maintenance mode info for display
            const maintenanceInfo = error.body || {};
            localStorage.setItem('maintenance', JSON.stringify({
                active: true,
                message: maintenanceInfo.message,
            }));
            return Promise.reject(maintenanceResponse);
        }
        
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
        const { name: fullName, ...rest } = response.json;
        const identity = ({ fullName, ...rest });
        localStorage.setItem('auth', JSON.stringify(identity))
        return identity;
    },
    getPermissions: async () => {
        if (isPublicRoute()) {
            return { guest: true };
        }
        if (!localStorage.getItem('auth')) {
            // No local session: skip the network round-trip (it would just 401),
            // so anonymous visitors aren't stuck on a loading spinner waiting for
            // react-query's retry backoff before "/" can decide to show the
            // public homepage instead of the dashboard. No message: this only
            // short-circuits a retry, it isn't a user-facing error.
            throw new Error();
        }
        const { permissions } = await authProvider.getIdentity();
        return permissions;
    },
    getMaintenanceInfo: () => {
        const maintenanceData = localStorage.getItem('maintenance');
        if (maintenanceData) {
            try {
                return JSON.parse(maintenanceData);
            } catch {
                return null;
            }
        }
        return null;
    },
    clearMaintenanceInfo: () => {
        localStorage.removeItem('maintenance');
    },
};

function isPublicRoute() {
    return location.pathname === '/register' || location.pathname === '/maintenance';
}

export default authProvider;
