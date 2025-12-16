import { useRecordContext, useResourceContext, useTranslate } from 'react-admin';
import EditIcon from '@mui/icons-material/Edit';
import { ActionOrDialogButton } from '@shared/components/crudContainers/ActionOrDialogButton';
import { CommonFormDialogContent } from './CommonFormDialog';

export const EditInDialogButton = ({
  Inputs,
  resource: resourceProp,
  label = 'ra.action.edit',
  icon = <EditIcon />,
  title,
  dialogProps,
  ...rest
}) => {
  const record = useRecordContext();
  const resource = useResourceContext({ resource: resourceProp });
  const translate = useTranslate();
  
  if (!record) return null;
  
  const defaultTitle = title || translate('ra.action.edit');
  
  return (
    <ActionOrDialogButton
      label={label}
      startIcon={icon}
      title={defaultTitle}
      dialogContent={({ onClose }) => (
        <CommonFormDialogContent
          mode="edit"
          resource={resource}
          record={record}
          onClose={onClose}
          {...dialogProps}
        >
          <Inputs isCreate={false} />
        </CommonFormDialogContent>
      )}
      {...rest}
    />
  );
};
