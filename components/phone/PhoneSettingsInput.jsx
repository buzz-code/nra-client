import { TextInput, maxLength, useGetIdentity } from 'react-admin';
import { CommonSettingsAccordion } from '@shared/components/settings/CommonSettingsAccordion';

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
        <CommonSettingsAccordion id="phone-settings" title="מספר טלפון" subtitle="מספר הטלפון שלך, לצורך שליחת הודעות">
            <TextInput
                source="phoneNumber"
                label="resources.settings.fields.phoneNumber"
                fullWidth
                validate={maxLength(11)}
                defaultValue={identity?.phoneNumber ?? ''}
            />
        </CommonSettingsAccordion>
    );
};
