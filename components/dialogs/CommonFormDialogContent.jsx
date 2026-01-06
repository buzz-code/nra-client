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
import { useCallback } from 'react';

/**
 * Dialog content component that works with ActionOrDialogButton
 * Uses React Admin's EditBase/CreateBase for proper form handling with automatic data fetching
 * 
 * @param {Object} props
 * @param {'edit'|'create'} props.mode - Dialog mode
 * @param {string} props.resource - Resource name
 * @param {Object} props.record - Record data (id for edit, initial values for create)
 * @param {Function} props.onClose - Callback to close the dialog
 * @param {Object} props.mutationOptions - Additional mutation options
 * @param {Function} props.transform - Transform function for data before save
 * @param {React.ReactNode} props.children - Form input components
 */
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
  
  const handleSuccess = useCallback(() => {
    const message = mode === 'edit' ? 'ra.notification.updated' : 'ra.notification.created';
    notify(message, { type: 'info' });
    refresh();
    onClose();
  }, [mode, notify, refresh, onClose]);
  
  const handleError = useCallback((error) => {
    const message = error?.message || 'ra.notification.http_error';
    notify(message, { type: 'error' });
  }, [notify]);
  
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
      <InlineFormContent onClose={onClose} mode={mode}>
        {children}
      </InlineFormContent>
    </BaseComponent>
  );
};

/**
 * Internal component to render form content within EditBase/CreateBase context
 * Separated to access useRecordContext from the Base component
 */
const InlineFormContent = ({ onClose, mode, children }) => {
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
