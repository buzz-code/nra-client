import { TextInput, useGetIdentity } from 'react-admin';
import { CommonSettingsAccordion } from '@shared/components/settings/CommonSettingsAccordion';

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
        <CommonSettingsAccordion
            id="yemot-settings"
            title="הגדרות Yemot (מערכת שיחות טלפון)"
            subtitle="חיבור למערכת השיחות של Yemot - להגדרה על ידי מנהל המערכת"
        >
            <TextInput
                source="yemotApiKey"
                label="resources.settings.fields.yemotApiKey"
                helperText="הזן את מפתח ה-API שקיבלת ממערכת Yemot לשליחת הודעות טלפון"
                fullWidth
                type="password"
                defaultValue={identity?.additionalData?.yemotApiKey ?? ''}
            />
        </CommonSettingsAccordion>
    );
};
