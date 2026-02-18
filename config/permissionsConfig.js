// client/shared/config/permissionsConfig.js
export const permissionKeys = {
    admin: 'admin',
    manager: 'manager',
    showUsersData: 'showUsersData',
    editPagesData: 'editPagesData',
    editPaymentTracksData: 'editPaymentTracksData',
    genericImageUpload: 'genericImageUpload',
    phoneCampaign: 'phoneCampaign',
    // Keys for permissions like 'inLessonReport', 'scannerUpload', etc.,
    // are intentionally omitted here as they are for a different app.
    // The generic permission checker will still function if these keys are
    // present on a user's permission object, but they are not formally
    // defined as part of this application's core permission set.
};