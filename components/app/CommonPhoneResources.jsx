import { Resource } from 'react-admin';
import phoneCampaign from '@shared/components/common-entities/phone-campaign';
import phoneTemplate from '@shared/components/common-entities/phone-template';
import PhoneIcon from '@mui/icons-material/Phone';
import DescriptionIcon from '@mui/icons-material/Description';
import { isPhoneCampaign } from '@shared/utils/permissionsUtil';

/**
 * Renders the phone campaign resources that are identical across all NRA apps:
 *   phone_template  (phoneCampaign permission)
 *   phone_campaign  (phoneCampaign permission)
 *
 * Props:
 *  - permissions {*} React-Admin permissions object
 */
const CommonPhoneResources = ({ permissions }) =>
  isPhoneCampaign(permissions) && (
    <>
      <Resource
        name="phone_template"
        {...phoneTemplate}
        options={{ menuGroup: 'settings' }}
        icon={DescriptionIcon}
      />
      <Resource
        name="phone_campaign"
        {...phoneCampaign}
        options={{ menuGroup: 'settings' }}
        icon={PhoneIcon}
      />
    </>
  );

export default CommonPhoneResources;