import { Link, Login, LoginForm, useTranslate } from 'react-admin';
import { useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import { HomePage } from './HomePage';

export const LoginPage = ({ homeContent, ...props }) => {
    const translate = useTranslate();
    const location = useLocation();

    if (location.pathname === '/' && homeContent) {
        return <HomePage {...homeContent} />;
    }

    return (
        <Login {...props}>
            <LoginForm {...props} />

            <Box height='2rem' display='flex' alignItems='center' justifyContent='center' paddingY='16px'>
                <Link to='/register'>
                    <span>{translate('ra.auth.sign_up_invitation')}</span>
                </Link>
            </Box>
        </Login>
    );
}
