import { CreateButton } from 'react-admin';
import { CreateInDialogButton } from './CreateInDialogButton';
import { useInlineEditContext } from './InlineEditContext';

export const CommonCreateButton = (props) => {
    const inlineEditContext = useInlineEditContext();
    
    // If no context, inline create is disabled, or CreateInputs is missing, use regular CreateButton
    if (!inlineEditContext || !inlineEditContext.inlineCreate || !inlineEditContext.CreateInputs) {
        return <CreateButton {...props} />;
    }
    
    // Otherwise, use CreateInDialogButton with Inputs from context
    return (
        <CreateInDialogButton
            Inputs={inlineEditContext.CreateInputs}
            title={inlineEditContext.dialogCreateTitle}
            {...props}
        />
    );
};
