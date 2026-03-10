import { Resource } from 'react-admin';
import textByUser from '@shared/components/common-entities/text-by-user';
import mailAddress from '@shared/components/common-entities/mail-address';
import image from '@shared/components/common-entities/image';
import importFile from '@shared/components/common-entities/import-file';
import RateReviewIcon from '@mui/icons-material/RateReview';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import ImageIcon from '@mui/icons-material/Image';
import UploadFileIcon from '@mui/icons-material/UploadFile';

/**
 * Renders the four settings resources that appear in every NRA app:
 *   text_by_user, mail_address, image, import_file
 *
 * Place this inside the permissions => { ... } callback alongside project-specific resource declarations.
 */
const CommonSettingsResources = () => (
    <>
        <Resource name="text_by_user" {...textByUser} options={{ menuGroup: 'settings' }} icon={RateReviewIcon} />
        <Resource name="mail_address" {...mailAddress} options={{ menuGroup: 'settings' }} icon={AlternateEmailIcon} />
        <Resource name="image" {...image} options={{ menuGroup: 'settings' }} icon={ImageIcon} />
        <Resource name="import_file" {...importFile} options={{ menuGroup: 'settings' }} icon={UploadFileIcon} />
    </>
);

export default CommonSettingsResources;
