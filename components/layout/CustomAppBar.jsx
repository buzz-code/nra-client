import { AppBar, TitlePortal } from 'react-admin';
import YearSelector from './YearSelector';

const CustomAppBar = (props) => (
    <AppBar {...props}>
        <TitlePortal />
        <YearSelector />
    </AppBar>
);

export default CustomAppBar;
