import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { useStore } from 'react-admin';
import { debounce, isEqual } from 'lodash';

export const AutoPersistInStore = ({ storeKey }) => {
    const { watch, reset, getValues } = useFormContext();
    const [savedValue, setSavedValue] = useStore(storeKey);

    // Restore saved value on mount
    useEffect(() => {
        if (savedValue) {
            // We merge with current values to avoid overwriting default values if savedValue is partial
            // But for a full form restore, reset(savedValue) is usually what we want.
            // However, we must be careful if the form schema changed.
            reset(savedValue);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Watch all fields
    const values = watch();

    // Save values to store on change
    // Debounce to avoid too many writes
    useEffect(() => {
        const save = debounce((val) => {
            if (!isEqual(val, savedValue)) {
                setSavedValue(val);
            }
        }, 1000);
        
        save(values);
        
        return () => save.cancel();
    }, [values, setSavedValue, savedValue]);

    return null;
};
