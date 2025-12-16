import { useResourceContext, useTranslate } from 'react-admin';
import AddIcon from '@mui/icons-material/Add';
import { ActionOrDialogButton } from '@shared/components/crudContainers/ActionOrDialogButton';
import { CommonFormDialogContent } from './CommonFormDialog';

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
  const resource = useResourceContext({ resource: resourceProp });
  const translate = useTranslate();
  
  const defaultTitle = title || translate('ra.action.create');
  
  return (
    <ActionOrDialogButton
      label={label}
      startIcon={icon}
      title={defaultTitle}
      dialogContent={({ onClose }) => (
        <CommonFormDialogContent
          mode="create"
          resource={resource}
          record={defaultValues}
          onClose={onClose}
          {...dialogProps}
        >
          <Inputs isCreate={true} />
        </CommonFormDialogContent>
      )}
      {...rest}
    />
  );
};
