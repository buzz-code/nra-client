import { useResourceContext, useTranslate } from 'react-admin';
import AddIcon from '@mui/icons-material/Add';
import { ActionOrDialogButton } from '@shared/components/crudContainers/ActionOrDialogButton';
import { CommonFormDialogContent } from './CommonFormDialogContent';

/**
 * Button component that opens a create dialog
 * Uses ActionOrDialogButton pattern and CreateBase for proper data handling
 * 
 * @param {Object} props
 * @param {React.Component} props.Inputs - Form inputs component
 * @param {string} props.resource - Resource name (optional, uses context if not provided)
 * @param {string} props.label - Button label (default: 'ra.action.create')
 * @param {React.ReactNode} props.icon - Button icon (default: AddIcon)
 * @param {string} props.title - Dialog title (optional)
 * @param {Object} props.defaultValues - Default values for new record
 * @param {Object} props.dialogProps - Additional props for dialog (mutationOptions, transform, etc.)
 */
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
