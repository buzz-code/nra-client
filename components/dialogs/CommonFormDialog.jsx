import { 
  EditBase,
  CreateBase,
  useRefresh,
  useNotify,
  SimpleForm,
  SaveButton,
  Button,
  useRecordContext
} from 'react-admin';
import { DialogContent, DialogActions } from '@mui/material';

// Dialog content component that works with ActionOrDialogButton
// Uses React Admin's EditBase/CreateBase for proper form handling
export const CommonFormDialogContent = ({
  mode,
  resource,
  record,
  onClose,
  mutationOptions,
  transform,
  children,
}) => {
  const refresh = useRefresh();
  const notify = useNotify();
  
  const handleSuccess = () => {
    notify(mode === 'edit' ? 'ra.notification.updated' : 'ra.notification.created', { type: 'info' });
    refresh();
    onClose();
  };
  
  const handleError = (error) => {
    notify(error.message || 'ra.notification.http_error', { type: 'error' });
  };
  
  const BaseComponent = mode === 'edit' ? EditBase : CreateBase;
  const baseProps = mode === 'edit' 
    ? { resource, id: record?.id }
    : { resource, record };
  
  return (
    <BaseComponent
      {...baseProps}
      mutationMode="pessimistic"
      mutationOptions={{
        onSuccess: handleSuccess,
        onError: handleError,
        ...mutationOptions,
      }}
      transform={transform}
    >
      <FormContent onClose={onClose} mode={mode}>
        {children}
      </FormContent>
    </BaseComponent>
  );
};

// Separate component to access form context from EditBase/CreateBase
const FormContent = ({ onClose, mode, children }) => {
  const record = useRecordContext();
  
  return (
    <>
      <DialogContent dividers>
        <SimpleForm
          record={record}
          toolbar={false}
          sx={{ p: 0 }}
        >
          {children}
        </SimpleForm>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          label="ra.action.cancel"
        />
        <SaveButton
          label={mode === 'edit' ? 'ra.action.save' : 'ra.action.create'}
          type="submit"
        />
      </DialogActions>
    </>
  );
};
