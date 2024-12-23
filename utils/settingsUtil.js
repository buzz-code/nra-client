import { DEFAULT_PAGE_SIZE } from "@shared/config/settings";
import { useGetIdentity } from "react-admin";

export const useDefaultPageSize = () => {
    const { identity } = useGetIdentity();
    return getDefaultPageSize(identity);
}

export function getDefaultPageSize(identity) {
    return identity?.additionalData?.defaultPageSize || DEFAULT_PAGE_SIZE;
}
