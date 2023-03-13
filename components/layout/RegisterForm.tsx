import * as React from 'react';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { Button, CardContent, CircularProgress } from '@mui/material';
import {
    Form,
    required,
    useTranslate,
    useNotify,
    useSafeSetState,
} from 'ra-core';
import { TextInput } from 'react-admin';

import useRegister from './useRegister';

export const RegisterForm = (props: RegisterFormProps) => {
    const { redirectTo, className } = props;
    const [loading, setLoading] = useSafeSetState(false);
    const register = useRegister();
    const translate = useTranslate();
    const notify = useNotify();

    const submit = (values: FormData) => {
        setLoading(true);
        register(values, redirectTo)
            .then(() => {
                setLoading(false);
            })
            .catch(error => {
                setLoading(false);
                notify(
                    typeof error === 'string'
                        ? error
                        : typeof error === 'undefined' || !error.message
                        ? 'ra.auth.sign_in_error'
                        : error.message,
                    {
                        type: 'error',
                        messageArgs: {
                            _:
                                typeof error === 'string'
                                    ? error
                                    : error && error.message
                                    ? error.message
                                    : undefined,
                        },
                    }
                );
            });
    };

    return (
        <StyledForm
            onSubmit={submit}
            mode="onChange"
            noValidate
            className={className}
        >
            <CardContent className={RegisterFormClasses.content}>
                <TextInput
                    autoFocus
                    source="username"
                    label={translate('ra.auth.username')}
                    validate={required()}
                    fullWidth
                />
                <TextInput
                    source="password"
                    label={translate('ra.auth.password')}
                    type="password"
                    autoComplete="current-password"
                    validate={required()}
                    fullWidth
                />

                <Button
                    variant="contained"
                    type="submit"
                    color="primary"
                    disabled={loading}
                    fullWidth
                    className={RegisterFormClasses.button}
                >
                    {loading ? (
                        <CircularProgress
                            className={RegisterFormClasses.icon}
                            size={19}
                            thickness={3}
                        />
                    ) : (
                        translate('ra.auth.sign_in')
                    )}
                </Button>
            </CardContent>
        </StyledForm>
    );
};

const PREFIX = 'RaRegisterForm';

export const RegisterFormClasses = {
    content: `${PREFIX}-content`,
    button: `${PREFIX}-button`,
    icon: `${PREFIX}-icon`,
};

const StyledForm = styled(Form, {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
    [`& .${RegisterFormClasses.content}`]: {
        width: 300,
    },
    [`& .${RegisterFormClasses.button}`]: {
        marginTop: theme.spacing(2),
    },
    [`& .${RegisterFormClasses.icon}`]: {
        margin: theme.spacing(0.3),
    },
}));

export interface RegisterFormProps {
    redirectTo?: string;
    className?: string;
}

interface FormData {
    username: string;
    password: string;
}
RegisterForm.propTypes = {
    redirectTo: PropTypes.string,
};
