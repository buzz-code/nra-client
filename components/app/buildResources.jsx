import React from 'react';
import { Resource } from 'react-admin';
import { filterArrayByParams } from '@shared/utils/filtersUtil';

/**
 * Converts a declarative resource definitions array into React-Admin <Resource> elements.
 *
 * Each item can be:
 *  - A plain object `{ name, config, icon, menuGroup, label?, hide? }`
 *  - A function `permissions => object | null` (return falsy to exclude)
 *
 * @param {Array<object|Function>} definitions
 * @param {object} permissions — the permissions object from React Admin
 * @returns {JSX.Element[]}
 */
export function buildResources(definitions, permissions) {
  return filterArrayByParams(definitions, permissions)
    .map(({ name, config, icon, menuGroup, hide, label }) => (
      <Resource
        key={name}
        name={name}
        {...(config || {})}
        icon={icon}
        options={{ menuGroup, hide, label }}
      />
    ));
}
