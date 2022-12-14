import { apiUrl } from "./constantsProvider";

const authProvider = {
    login: ({ username, password }) => {
        const request = new Request(apiUrl + '/auth/login', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
            headers: new Headers({ 'Content-Type': 'application/json' }),
        });
        return fetch(request)
            .then(response => {
                if (response.status < 200 || response.status >= 300) {
                    throw new Error(response.statusText);
                }
                return response.json();
            })
            .then(auth => {
                localStorage.setItem('auth', auth.access_token);
            })
            .catch((error) => {
                console.log(error)
                throw new Error('Network error')
            });
    },
    logout: () => {
        localStorage.removeItem('auth');
        return Promise.resolve();
    },
    checkAuth: () =>
        localStorage.getItem('auth') ? Promise.resolve() : Promise.reject(),
    checkError: (error) => {
        const status = error.status;
        if (status === 401 || status === 403) {
            localStorage.removeItem('auth');
            return Promise.reject();
        }
        // other error code (404, 500, etc): no need to log out
        return Promise.resolve();
    },
    getIdentity: async () => {
        try {
            const token = localStorage.getItem('auth')

            const response = await fetch(apiUrl + '/profile', {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
            });

            const { name, permissions } = await response.json();

            return Promise.resolve({ fullName: name, permissions });
        } catch (error) {
            return Promise.reject(error);
        }
    },
    getPermissions: async () => {
        const identity = await authProvider.getIdentity()
        return Promise.resolve(identity.permissions);
    },
};

export default authProvider;
