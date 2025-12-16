import { 
  useUpdate, 
  useCreate, 
  useRefresh, 
  useNotify,
  SimpleForm,
  SaveButton,
  Button
} from 'react-admin';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

export const CommonFormDialog = ({
  mode,
  resource,
  record,
  open,
  onClose,
  title,
  maxWidth = 'md',
  fullWidth = true,
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
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      scroll="paper"
      dir="rtl"
      aria-labelledby="form-dialog-title"
      onClick={(e) => e.stopPropagation()}
    >
      <DialogTitle id="form-dialog-title">
        {title || (mode === 'edit' ? 'עריכה' : 'יצירה חדשה')}
      </DialogTitle>
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
    </Dialog>
  );
};
