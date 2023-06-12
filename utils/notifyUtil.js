export const handleError = (notify) => (error) => {
    notify(
        typeof error === 'string'
            ? error
            : error.message ?? error.body?.message ?? 'ra.notification.http_error',
        {
            type: 'error',
            messageArgs: {
                _: typeof error === 'string'
                    ? error
                    : error && error.message
                        ? error.message
                        : undefined
            }
        }
    );
};
