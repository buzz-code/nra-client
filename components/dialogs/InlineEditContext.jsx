import { createContext, useContext } from 'react';

/**
 * Context for providing inline edit configuration to descendant components
 * 
 * Context value shape:
 * @typedef {Object} InlineEditContextValue
 * @property {boolean} inlineCreate - Whether inline create is enabled
 * @property {React.Component} CreateInputs - Form inputs component for create dialog
 * @property {string} dialogCreateTitle - Custom title for create dialog
 */
const InlineEditContext = createContext(null);

/**
 * Provider component for InlineEditContext
 * Used in CommonEntity to provide inline edit configuration
 */
export const InlineEditProvider = InlineEditContext.Provider;

/**
 * Hook to access inline edit context
 * @returns {InlineEditContextValue|null} Context value or null if not in provider
 */
export const useInlineEditContext = () => {
    return useContext(InlineEditContext);
};
