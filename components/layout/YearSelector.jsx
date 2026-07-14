import { useState } from 'react';
import { Button, Menu, MenuItem } from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { defaultYearFilter, updateDefaultYear, yearChoices } from '@shared/utils/yearFilter';

// Mirrors react-admin's own LocalesMenuButton (Button + Menu, color="inherit")
// so it reads as another AppBar menu, not a stray form field.
//
// A full reload is required after changing the year: defaultYearFilter.year is
// read once at import time by every entity file's filterDefaultValues, so those
// static values only pick up the new year on a fresh load (see yearFilter.js).
const YearSelector = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const currentChoice = yearChoices.find((choice) => choice.id === defaultYearFilter.year);

    const handleClick = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);
    const handleSelect = (year) => () => {
        setAnchorEl(null);
        updateDefaultYear(year);
        window.location.reload();
    };

    return (
        <>
            <Button
                color="inherit"
                variant="text"
                aria-controls="year-menu"
                aria-haspopup="true"
                onClick={handleClick}
                startIcon={<EventIcon />}
                endIcon={<ExpandMoreIcon fontSize="small" />}
            >
                {currentChoice?.name}
            </Button>
            <Menu id="year-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
                {yearChoices.map((choice) => (
                    <MenuItem
                        key={choice.id}
                        onClick={handleSelect(choice.id)}
                        selected={choice.id === defaultYearFilter.year}
                    >
                        {choice.name}
                    </MenuItem>
                ))}
            </Menu>
        </>
    );
};

export default YearSelector;
