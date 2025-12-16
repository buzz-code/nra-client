import { CreateButton } from 'react-admin';
import { CreateInDialogButton } from './CreateInDialogButton';
import { useInlineEditContext } from './InlineEditContext';

/**
 * Smart create button that decides between inline dialog or regular navigation
 * based on InlineEditContext
 * 
 * If context provides inline create configuration, renders CreateInDialogButton
 * Otherwise, renders standard CreateButton
 * 
 * @param {Object} props - Additional props passed to the button
 */
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
