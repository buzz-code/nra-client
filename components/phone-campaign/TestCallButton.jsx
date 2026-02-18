import { useDataProvider, useNotify, useRecordContext, TextInput, required, Form, SaveButton, useTranslate } from 'react-admin';
import PhoneIcon from '@mui/icons-material/Phone';
import { DialogContent, DialogActions, Button as MuiButton, Stack, Alert } from '@mui/material';
import { ActionOrDialogButton } from '@shared/components/crudContainers/ActionOrDialogButton';
import { handleActionSuccess, handleError } from '@shared/utils/notifyUtil';

export const TestCallButton = () => {
  const record = useRecordContext();
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const translate = useTranslate();

  if (!record?.id) {
    return null;
  }

  const handleSubmit = async (values, onClose) => {
    try {
      await dataProvider.action('phone_campaign', 'testCall', {}, {
        templateId: record.id,
        phone: values.phone
      });

      handleActionSuccess(notify)('שיחת מבחן יצאה בהצלחה');
      onClose();
    } catch (error) {
      handleError(notify)(error);
    }
  };

  return (
    <ActionOrDialogButton
      label="שיחת מבחן"
      startIcon={<PhoneIcon />}
      size="small"
      variant="outlined"
      title="שיחת מבחן"
      dialogContent={({ onClose }) => (
        <Form onSubmit={(values) => handleSubmit(values, onClose)}>
          <DialogContent>
            <Stack spacing={2}>
              <Alert severity="info">
                יישלח שיחה לטלפון שתזין עם ההודעה מהתבנית
              </Alert>
              <TextInput
                source="phone"
                label="מספר טלפון"
                validate={required()}
                fullWidth
                helperText="הזן מספר טלפון"
                placeholder="0501234567"
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <MuiButton onClick={onClose}>{translate('ra.action.cancel')}</MuiButton>
            <SaveButton label={translate('ra.action.confirm')} />
          </DialogActions>
        </Form>
      )}
    />
  );
};
