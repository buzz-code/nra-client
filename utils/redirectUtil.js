import { useCallback } from 'react';
import { useRedirect, useResourceContext } from 'react-admin';

export const useCommonRedirect = ({ resource }) => {
  const resourceName = useResourceContext({ resource });
  const redirectMethod = useRedirect();
  return useCallback(() => {
    redirectMethod('list', resourceName);
  }, [redirectMethod, resourceName]);
}