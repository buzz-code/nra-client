import { required } from 'react-admin';
import { BulkActionButton } from '@shared/components/crudContainers/BulkActionButton';
import PhoneIcon from '@mui/icons-material/Phone';
import CommonReferenceInput from '@shared/components/fields/CommonReferenceInput';

/**
 * A bulk action button that triggers a phone campaign for selected records.
 *
 * Usage: add this to the `additionalBulkButtons` of a CommonDatagrid.
 * The host resource's backend service must implement the 'execute-phone-campaign'
 * action and handle extracting phone numbers from the selected IDs.
 *
 * @example
 * const additionalBulkButtons = [<PhoneTemplateBulkButton key="phone" />];
 * <CommonDatagrid additionalBulkButtons={additionalBulkButtons}>...</CommonDatagrid>
 */
const PhoneTemplateBulkButton = () => (
    <BulkActionButton
        label="resources.phone_template.actions.send_campaign"
        icon={<PhoneIcon />}
        name="execute-phone-campaign"
        reloadOnEnd
    >
        <CommonReferenceInput
            source="templateId"
            reference="phone_template"
            validate={required()}
            filter={{ isActive: true }}
            label="resources.phone_template.fields.select_template"
        />
    </BulkActionButton>
);

export default PhoneTemplateBulkButton;
