import { useState } from 'react';
import { Button, useRecordContext, useResourceContext } from 'react-admin';
import EditIcon from '@mui/icons-material/Edit';
import { CommonFormDialog } from './CommonFormDialog';

export const EditInDialogButton = ({
  Inputs,
  resource: resourceProp,
  label = 'ra.action.edit',
  icon = <EditIcon />,
  title,
  dialogProps,
  ...rest
}) => {
  const [open, setOpen] = useState(false);
  const record = useRecordContext();
  const resource = useResourceContext({ resource: resourceProp });
  
  if (!record) return null;
  
  return (
    <>
      <Button
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
        label={label}
        startIcon={icon}
        {...rest}
      />
      {open && (
        <CommonFormDialog
          mode="edit"
          resource={resource}
          record={record}
          open={open}
          onClose={() => setOpen(false)}
          title={title}
          {...dialogProps}
        >
          <Inputs isCreate={false} />
        </CommonFormDialog>
      )}
    </>
  );
};
