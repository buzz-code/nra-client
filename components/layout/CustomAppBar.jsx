import { AppBar, TitlePortal } from 'react-admin';
import YearSelector from './YearSelector';

const CustomAppBar = ({ showYearSelector = true, ...props }) => (
    <AppBar {...props}>
        <TitlePortal />
        {showYearSelector && <YearSelector />}
    </AppBar>
);

export default CustomAppBar;
