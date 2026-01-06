import { useRecordContext, useResourceContext, useTranslate } from 'react-admin';
import EditIcon from '@mui/icons-material/Edit';
import { ActionOrDialogButton } from '@shared/components/crudContainers/ActionOrDialogButton';
import { CommonFormDialogContent } from './CommonFormDialogContent';

/**
 * Button component that opens an edit dialog for the current row
 * Uses ActionOrDialogButton pattern and EditBase for proper data handling
 * 
 * @param {Object} props
 * @param {React.Component} props.Inputs - Form inputs component
 * @param {string} props.resource - Resource name (optional, uses context if not provided)
 * @param {string} props.label - Button label (default: 'ra.action.edit')
 * @param {React.ReactNode} props.icon - Button icon (default: EditIcon)
 * @param {string} props.title - Dialog title (optional)
 * @param {Object} props.dialogProps - Additional props for dialog (mutationOptions, transform, etc.)
 */
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
