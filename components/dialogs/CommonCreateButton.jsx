import { CreateButton } from 'react-admin';
import { CreateInDialogButton } from './CreateInDialogButton';
import { useInlineEditContext } from './InlineEditContext';

export const CommonCreateButton = (props) => {
    const inlineEditContext = useInlineEditContext();
    
    // If no context or inline create is disabled, use regular CreateButton
    if (!inlineEditContext || !inlineEditContext.inlineCreate) {
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
