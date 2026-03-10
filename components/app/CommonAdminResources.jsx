import { Resource } from 'react-admin';
import text from '@shared/components/common-entities/text';
import user from '@shared/components/common-entities/user';
import auditLog from '@shared/components/common-entities/audit-log';
import mailAddress from '@shared/components/common-entities/mail-address';
import recievedMail from '@shared/components/common-entities/recieved-mail';
import page from '@shared/components/common-entities/page';
import paymentTrack from '@shared/components/common-entities/payment-track';
import yemotCall from '@shared/components/common-entities/yemot-call';
import SettingsPhoneIcon from '@mui/icons-material/SettingsPhone';
import EmailIcon from '@mui/icons-material/Email';
import LogoDevIcon from '@mui/icons-material/LogoDev';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import { isAdmin, isShowUsersData, isEditPagesData, isEditPaymentTracksData } from '@shared/utils/permissionsUtil';

/**
 * Renders the admin-gated resources that are identical across all NRA apps:
 *   text, yemot_call, recieved_mail, audit_log  (admin only)
 *   user                                         (showUsersData permission)
 *   page                                         (editPagesData permission)
 *   payment_track                                (editPaymentTracks / showUsersData, optional)
 *
 * Props:
 *  - permissions      {*}       React-Admin permissions object
 *  - showPaymentTrack {boolean} Whether to include the payment_track resource (default: true)
 */
const CommonAdminResources = ({ permissions, showPaymentTrack = true }) => (
    <>
        {isAdmin(permissions) && <>
            <Resource name="text" {...text} options={{ menuGroup: 'admin' }} />
            <Resource name="yemot_call" {...yemotCall} options={{ menuGroup: 'admin' }} icon={SettingsPhoneIcon} />
            <Resource name="recieved_mail" {...recievedMail} options={{ menuGroup: 'admin' }} icon={EmailIcon} />
            <Resource name="audit_log" {...auditLog} options={{ menuGroup: 'admin' }} icon={LogoDevIcon} />
        </>}

        {isShowUsersData(permissions) && <>
            <Resource name="user" {...user} create={isAdmin(permissions) && user.create} options={{ menuGroup: 'admin' }} icon={AccountBoxIcon} />
        </>}

        {isEditPagesData(permissions) && <>
            <Resource name="page" {...page} options={{ menuGroup: 'admin' }} icon={AutoStoriesIcon} />
        </>}

        {showPaymentTrack && (isEditPaymentTracksData(permissions) || isShowUsersData(permissions)) && <>
            <Resource name="payment_track" {...paymentTrack} list={isEditPaymentTracksData(permissions) ? paymentTrack.list : null} options={{ menuGroup: 'admin' }} icon={MonetizationOnIcon} />
        </>}
    </>
);

export default CommonAdminResources;
