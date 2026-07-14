import { useState } from 'react';
import { TextField } from '@mui/material';
import { defaultYearFilter, updateDefaultYear, yearChoices } from '@shared/utils/yearFilter';

// A full reload is required after changing the year: defaultYearFilter.year is
// read once at import time by every entity file's filterDefaultValues, so those
// static values only pick up the new year on a fresh load (see yearFilter.js).
const YearSelector = () => {
    const [year, setYear] = useState(defaultYearFilter.year);

    const handleChange = (event) => {
        const value = event.target.value;
        setYear(value);
        updateDefaultYear(value);
        window.location.reload();
    };

    return (
        <TextField
            select
            variant="standard"
            SelectProps={{ native: true }}
            InputProps={{ disableUnderline: true }}
            size="small"
            fullWidth={false}
            value={year}
            onChange={handleChange}
            sx={{
                width: 76,
                mx: 1.5,
                flexShrink: 0,
                '& .MuiInputBase-input': { color: 'inherit', fontWeight: 600 },
                '& .MuiNativeSelect-icon': { color: 'inherit' },
            }}
        >
            {yearChoices.map((choice) => (
                <option key={choice.id} value={choice.id}>
                    {choice.name}
                </option>
            ))}
        </TextField>
    );
};

export default YearSelector;
