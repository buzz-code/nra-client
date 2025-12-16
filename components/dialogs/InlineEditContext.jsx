import { createContext, useContext } from 'react';

const InlineEditContext = createContext(null);

export const InlineEditProvider = InlineEditContext.Provider;

export const useInlineEditContext = () => {
    return useContext(InlineEditContext);
};
