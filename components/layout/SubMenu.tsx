import * as React from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMoreOutlined';
import ExpandLessIcon from '@mui/icons-material/ExpandLessOutlined';
import { List, ListItem, ListItemText, Collapse } from '@mui/material';
import { useTranslate, useSidebarState, useStore } from 'react-admin';


export const SubMenu = (props: SubMenuProps) => {
    const { isDropdownOpen, primaryText, leftIcon, children, ...rest } = props;
    const translate = useTranslate();
    const [open] = useSidebarState();
    const [isOpen, setIsOpen] = useStore('common.SubMenu.open.' + primaryText, isDropdownOpen)

    const handleToggle = () => {
        setIsOpen(!isOpen);
    };

    return (
        <React.Fragment>
            <ListItem
                dense
                button
                onClick={handleToggle}
                sx={{
                    paddingLeft: '1rem',
                    marginInline: 1,
                    width: 'auto',
                    borderRadius: 2,
                    color: 'text.secondary',
                    '&:hover': {
                        backgroundColor: 'action.hover',
                    },
                }}
            >
                {leftIcon}
                <ListItemText
                    inset
                    disableTypography
                    primary={translate(primaryText)}
                    sx={{
                        paddingLeft: 2,
                        fontSize: '1rem',
                        fontWeight: 600,
                        color: 'text.secondary',
                    }}
                />
                {isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </ListItem>
            <Collapse in={isOpen} timeout="auto" unmountOnExit>
                <List
                    component="div"
                    disablePadding
                    sx={open ? {
                        paddingLeft: '25px',
                        transition: 'padding-left 195ms cubic-bezier(0.4, 0, 0.6, 1) 0ms',
                    } : {
                        paddingLeft: 0,
                        transition: 'padding-left 195ms cubic-bezier(0.4, 0, 0.6, 1) 0ms',
                    }}
                >
                    {children}
                </List>
            </Collapse>
        </React.Fragment>
    )
}

export type SubMenuProps = {
    children?: React.ReactNode;
    isDropdownOpen?: boolean;
    leftIcon?: React.ReactElement;
    primaryText?: string;
};

export default SubMenu;
