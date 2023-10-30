import { InputProps, UseUniqueOptions, useUnique as useUniqueBase } from "react-admin"
import { useIsAdmin } from "./permissionsUtil";

export const useUnique = (options?: UseUniqueOptions) => {
    const isAdmin = useIsAdmin();
    const validationFunctionWrapper = useUniqueBase(options);

    return (params: UseUniqueOptions = {}) => {
        return async (value: any, allValues: any, props: InputProps) => {
            if (isAdmin) {
                params.filter ??= {};
                params.filter.userId = allValues.userId;
            }
            return validationFunctionWrapper(params)(value, allValues, props)
        }
    };
}