import { useState } from 'react';
import { Button, useResourceContext } from 'react-admin';
import AddIcon from '@mui/icons-material/Add';
import { CommonFormDialog } from './CommonFormDialog';

export const CreateInDialogButton = ({
  Inputs,
  resource: resourceProp,
  label = 'ra.action.create',
  icon = <AddIcon />,
  title,
  defaultValues,
  dialogProps,
  ...rest
}) => {
  const [open, setOpen] = useState(false);
  const resource = useResourceContext({ resource: resourceProp });
  
  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        label={label}
        startIcon={icon}
        {...rest}
      />
      {open && (
        <CommonFormDialog
          mode="create"
          resource={resource}
          record={defaultValues}
          open={open}
          onClose={() => setOpen(false)}
          title={title}
          {...dialogProps}
        >
          <Inputs isCreate={true} />
        </CommonFormDialog>
      )}
    </>
  );
};
