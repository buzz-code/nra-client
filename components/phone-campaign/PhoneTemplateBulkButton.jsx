import { useState } from 'react';
import { useDataProvider, useNotify, useListContext, useRefresh, required, Form, SaveButton, useTranslate } from 'react-admin';
import CampaignIcon from '@mui/icons-material/Campaign';
import CommonReferenceInput from '@shared/components/fields/CommonReferenceInput';
import { handleActionSuccess, handleError } from '@shared/utils/notifyUtil';
import { ActionOrDialogButton } from '@shared/components/crudContainers/ActionOrDialogButton';
import { DialogContent, DialogActions, Button as MuiButton, Stack, Alert } from '@mui/material';

const MAX_RECIPIENTS = 1000;

export const PhoneTemplateBulkButton = () => {
  const { selectedIds, onUnselectItems } = useListContext();
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const refresh = useRefresh();
  const translate = useTranslate();
  const [isExecuting, setIsExecuting] = useState(false);

  const hasValidSelection = selectedIds.length > 0 && selectedIds.length <= MAX_RECIPIENTS;

  const handleSubmit = async (values, onClose) => {
    if (!values.templateId) {
      return;
    }

    setIsExecuting(true);
    try {
      // Create campaign with recipientIds and execute immediately
      const result = await dataProvider.action('phone_campaign', 'executeFromBulk', {}, {
        templateId: values.templateId,
        recipientIds: selectedIds
      });

      handleActionSuccess(notify)(result?.message || 'הקמפיין הופעל בהצלחה');
      onClose();
      onUnselectItems();
      refresh();
    } catch (error) {
      handleError(notify)(error);
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <ActionOrDialogButton
      label="קמפיין טלפוני"
      startIcon={<CampaignIcon />}
      disabled={!hasValidSelection}
      title="קמפיין טלפוני"
      dialogContent={({ onClose }) => (
        <Form onSubmit={(values) => handleSubmit(values, onClose)}>
          <DialogContent>
            <Stack spacing={2}>
              {selectedIds.length === 0 && (
                <Alert severity="warning">לא נבחרו רשומות</Alert>
              )}
              {selectedIds.length > MAX_RECIPIENTS && (
                <Alert severity="error">
                  נבחרו יותר מדי רשומות. מקסימום: {MAX_RECIPIENTS}
                </Alert>
              )}
              {selectedIds.length > 0 && selectedIds.length <= MAX_RECIPIENTS && (
                <Alert severity="info">
                  {selectedIds.length} רשומות נבחרו. הקמפיין יופעל מיד לאחר הבחירה.
                </Alert>
              )}
              <CommonReferenceInput
                source="templateId"
                reference="phone_template"
                label="בחר תבנית"
                validate={required()}
                fullWidth
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <MuiButton onClick={onClose} disabled={isExecuting}>
              {translate('ra.action.cancel')}
            </MuiButton>
            <SaveButton label="הפעל קמפיין" disabled={isExecuting} />
          </DialogActions>
        </Form>
      )}
    />
  );
};
