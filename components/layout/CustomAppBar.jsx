import { AppBar, TitlePortal } from 'react-admin';
import YearSelector from './YearSelector';

// content: what the app bar shows next to the title. Defaults to the year picker;
// pass null for nothing, or an app's own control (e.g. a project switcher).
const CustomAppBar = ({ content = <YearSelector />, ...props }) => (
    <AppBar {...props}>
        <TitlePortal />
        {content}
    </AppBar>
);

export default CustomAppBar;
