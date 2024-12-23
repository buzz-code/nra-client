import { DEFAULT_PAGE_SIZE } from "@shared/config/settings";
import { useGetIdentity } from "react-admin";

export const useDefaultPageSize = () => {
    const { identity } = useGetIdentity();
    return getDefaultPageSize(identity);
}

export function getDefaultPageSize(identity) {
    return identity?.additionalData?.defaultPageSize || DEFAULT_PAGE_SIZE;
}

export function useLateValue() {
   const { identity } = useGetIdentity();
   return getLateValue(identity);
}

export function getLateValue(identity) {
    return identity?.additionalData?.lateValue || 0.3
}