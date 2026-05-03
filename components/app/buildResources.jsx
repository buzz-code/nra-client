import React from 'react';
import { Resource } from 'react-admin';

/**
 * Converts a declarative resource definitions array into React-Admin <Resource> elements.
 *
 * @param {Array<{ name, config, icon, menuGroup, label?, hide?, condition? }>} definitions
 * @param {object} permissions — the permissions object from React Admin
 * @returns {JSX.Element[]}
 */
export function buildResources(definitions, permissions) {
  return definitions
    .filter(({ condition }) => !condition || condition(permissions))
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
