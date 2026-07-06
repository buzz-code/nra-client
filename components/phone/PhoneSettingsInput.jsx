import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { TextInput, maxLength, useGetIdentity } from 'react-admin';

/**
 * Settings accordion section for updating the user's phone number.
 *
 * Usage: render inside a react-admin SimpleForm on the user settings page.
 * The form field name is `phoneNumber`, saved via dataProvider.updateProfile.
 *
 * @example
 * <SimpleForm>
 *   <PhoneSettingsInput />
 * </SimpleForm>
 */
export const PhoneSettingsInput = () => {
    const { identity } = useGetIdentity();
    return (
        <Accordion sx={{ width: '100%' }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">מספר טלפון</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <TextInput
                    source="phoneNumber"
                    label="resources.settings.fields.phoneNumber"
                    fullWidth
                    validate={maxLength(11)}
                    defaultValue={identity?.phoneNumber ?? ''}
                />
            </AccordionDetails>
        </Accordion>
    );
};
