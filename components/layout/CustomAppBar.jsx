import { AppBar, TitlePortal, UserMenu, useGetIdentity } from 'react-admin';
import YearSelector from './YearSelector';

// On narrow screens react-admin's UserMenu collapses to an icon whose
// tooltip/aria-label defaults to the generic "Profile" translation instead
// of the signed-in user's name. Passing the identity's name as the label
// keeps the wide-screen behavior (which already shows the name) and fixes
// the narrow-screen tooltip to show the same name.
const CustomUserMenu = (props) => {
    const { identity } = useGetIdentity();
    return <UserMenu {...props} label={identity?.fullName} />;
};

const CustomAppBar = (props) => (
    <AppBar {...props} userMenu={<CustomUserMenu />}>
        <TitlePortal />
        <YearSelector />
    </AppBar>
);

export default CustomAppBar;
