import { useCreatePath, useResourceContext } from 'react-admin';

export const useCommonRedirect = ({ resource }) => {
  const resourceName = useResourceContext({ resource });
  const createPath = useCreatePath();

  return createPath({ resource: resourceName, type: 'list' });
}