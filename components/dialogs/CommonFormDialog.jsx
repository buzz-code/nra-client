import { 
  useUpdate, 
  useCreate, 
  useRefresh, 
  useNotify,
  SimpleForm,
  SaveButton,
  Button
} from 'react-admin';
import { DialogContent, DialogActions } from '@mui/material';

// Dialog content component that works with ActionOrDialogButton
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
  
  const [update, { isLoading: isUpdating }] = useUpdate();
  const [create, { isLoading: isCreating }] = useCreate();
  
  const isLoading = isUpdating || isCreating;
  
  const handleSave = (data) => {
    const transformedData = transform ? transform(data) : data;
    
    if (mode === 'edit') {
      update(
        resource,
        { id: record.id, data: transformedData },
        {
          onSuccess: () => {
            notify('ra.notification.updated', { type: 'info' });
            refresh();
            onClose();
          },
          onError: (error) => {
            notify(error.message || 'ra.notification.http_error', { type: 'error' });
          },
          ...mutationOptions,
        }
      );
    } else {
      create(
        resource,
        { data: transformedData },
        {
          onSuccess: () => {
            notify('ra.notification.created', { type: 'info' });
            refresh();
            onClose();
          },
          onError: (error) => {
            notify(error.message || 'ra.notification.http_error', { type: 'error' });
          },
          ...mutationOptions,
        }
      );
    }
  };
  
  return (
    <>
      <DialogContent dividers>
        <SimpleForm
          onSubmit={handleSave}
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
          disabled={isLoading}
        />
        <SaveButton
          alwaysEnable={false}
          disabled={isLoading}
          label={mode === 'edit' ? 'ra.action.save' : 'ra.action.create'}
          type="submit"
        />
      </DialogActions>
    </>
  );
};
