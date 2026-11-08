import { AppBar, TitlePortal } from 'react-admin';
import YearSelector from './YearSelector';

// The app's own icon (client/public/icon.svg) before the title; hidden if the app has none.
const hideOnError = (e) => { e.currentTarget.style.display = 'none'; };
const AppLogo = () => (
    <img src="/icon.svg" alt="" width={28} height={28} style={{ marginInlineEnd: 8, flexShrink: 0 }} onError={hideOnError} />
);

// content: what the app bar shows next to the title. Defaults to the year picker;
// pass null for nothing, or an app's own control (e.g. a project switcher).
const CustomAppBar = ({ content = <YearSelector />, ...props }) => (
    <AppBar {...props}>
        <AppLogo />
        <TitlePortal />
        {content}
    </AppBar>
);

export default CustomAppBar;
