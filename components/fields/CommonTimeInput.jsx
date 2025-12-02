import { useInput, TextInput } from 'react-admin';

/**
 * A time input component that outputs time as a string (HH:mm format)
 * instead of a Date object. This avoids timezone conversion issues
 * when sending time data to the server.
 * 
 * Usage:
 *   <CommonTimeInput source="startTime" label="Start Time" />
 * 
 * The value stored in the form will be a string like "14:30"
 */
export const CommonTimeInput = (props) => {
    const { source, ...rest } = props;

    return (
        <TextInput
            source={source}
            type="time"
            InputLabelProps={{ shrink: true }}
            {...rest}
        />
    );
};

export default CommonTimeInput;
