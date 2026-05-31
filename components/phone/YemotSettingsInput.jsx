import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { TextInput, useGetIdentity } from 'react-admin';

/**
 * Settings accordion section for Yemot (phone campaign) API key configuration.
 *
 * Usage: render inside a react-admin SimpleForm on the user settings page.
 * The form field name is `yemotApiKey` which maps to `additionalData.yemotApiKey`.
 *
 * @example
 * <SimpleForm>
 *   <YemotSettingsInput />
 * </SimpleForm>
 */
export const YemotSettingsInput = () => {
    const { identity } = useGetIdentity();
    return (
        <Accordion sx={{ width: '100%' }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">הגדרות Yemot (מערכת שיחות טלפון)</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <TextInput
                    source="yemotApiKey"
                    label="resources.settings.fields.yemotApiKey"
                    helperText="הזן את מפתח ה-API שקיבלת ממערכת Yemot לשליחת הודעות טלפון"
                    fullWidth
                    type="password"
                    defaultValue={identity?.additionalData?.yemotApiKey ?? ''}
                />
            </AccordionDetails>
        </Accordion>
    );
};
