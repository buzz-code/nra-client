import { useInput } from 'react-admin';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

export const CommonSliderInput = ({ source, ...props }) => {
    const { id, field, fieldState, formState, isRequired } = useInput({ source });

    return (
        <Grid container>
            <Grid item xs={6}>
                <Typography id={id} gutterBottom>
                    {props.label}
                </Typography>
            </Grid>
            <Grid item xs={6}>
                <Slider
                    aria-labelledby={id}
                    valueLabelDisplay="auto"
                    step={1}
                    marks
                    {...field}
                    {...props}
                />
                {fieldState.error && <span>{fieldState.error.message}</span>}
            </Grid>
        </Grid>
    )
}

