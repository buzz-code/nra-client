import React from 'react';
import { Typography, Accordion, AccordionSummary, AccordionDetails, Alert } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { PasswordInput, minLength } from 'react-admin';

const validateApiKey = [
  minLength(10, 'מפתח API חייב להכיל לפחות 10 תווים')
];

export function YemotSettingsInput() {
  return (
    <Accordion sx={{ width: '100%' }}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="yemot-settings-content"
        id="yemot-settings-header"
      >
        <Typography variant="h6">הגדרות ימות המשיח</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Alert severity="info" sx={{ mb: 2 }}>
          מפתח API נדרש לשליחת שיחות טלפוניות דרך מערכת ימות המשיח.
          ניתן לקבל מפתח מ-{' '}
          <a href="https://www.call2all.co.il" target="_blank" rel="noopener noreferrer">
            www.call2all.co.il
          </a>
        </Alert>
        <PasswordInput
          source="additionalData.yemotApiKey"
          label="מפתח API של ימות המשיח"
          fullWidth
          helperText="הזן את מפתח ה-API שלך מימות המשיח. יש לוודא שהמפתח תקין כדי לאפשר שליחת שיחות טלפוניות."
          validate={validateApiKey}
        />
      </AccordionDetails>
    </Accordion>
  );
}
