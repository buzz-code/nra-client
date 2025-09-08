import React from 'react';
import { Rating, FormControl, FormLabel, FormHelperText, Box } from '@mui/material';
import { get } from 'lodash';
import { useInput, useRecordContext, useTranslate } from 'react-admin';

const defaultMaxRating = 3;

export const CommonRatingField = ({ source, max = defaultMaxRating, ...props }) => {
  const record = useRecordContext();
  const value = get(record, source, null);
  
  return (
    <Rating
      value={value}
      max={max}
      readOnly
      {...props}
    />
  );
};

export const CommonRatingInput = ({ source, label, max = defaultMaxRating, ...props }) => {
  const {
    field: { value, onChange },
    fieldState: { error }
  } = useInput({ source });
  
  const translate = useTranslate();
  const finalLabel = label || translate(`resources.event.fields.${source}`, { _: source });
  
  return (
    <FormControl error={!!error} margin="normal">
      <FormLabel component="legend">{finalLabel}</FormLabel>
      <Box sx={{ mt: 1 }}>
        <Rating
          value={value || 0}
          max={max}
          onChange={(event, newValue) => {
            onChange(newValue);
          }}
          {...props}
        />
      </Box>
      {error && <FormHelperText>{error.message}</FormHelperText>}
    </FormControl>
  );
};
