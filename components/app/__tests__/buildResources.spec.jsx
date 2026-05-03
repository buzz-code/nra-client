import React from 'react';
import { buildResources } from '../buildResources';

jest.mock('react-admin', () => ({
  Resource: 'Resource',
}));
jest.mock('@shared/utils/filtersUtil', () => ({
  filterArrayByParams: (items, params) =>
    items.map(item => typeof item === 'function' ? item(params) : item).filter(item => item),
}));

describe('buildResources', () => {
  const mockConfig = { list: () => null, edit: () => null };

  const definitions = [
    { name: 'always', config: mockConfig, icon: null, menuGroup: 'data' },
    p => p.isAdmin && { name: 'admin-only', config: mockConfig, icon: null, menuGroup: 'admin' },
    { name: 'no-config', icon: null, menuGroup: 'data' },
  ];

  it('filters out resources whose condition returns false', () => {
    const result = buildResources(definitions, { isAdmin: false });
    expect(result).toHaveLength(2);
    expect(result.map(r => r.props.name)).not.toContain('admin-only');
  });

  it('includes all resources when condition returns true', () => {
    const result = buildResources(definitions, { isAdmin: true });
    expect(result).toHaveLength(3);
  });

  it('renders correct resource names', () => {
    const result = buildResources(definitions, { isAdmin: true });
    expect(result.map(r => r.props.name)).toEqual(['always', 'admin-only', 'no-config']);
  });

  it('spreads config onto the Resource', () => {
    const result = buildResources([{ name: 'foo', config: mockConfig, icon: null, menuGroup: 'data' }], {});
    expect(result[0].props.list).toBe(mockConfig.list);
  });

  it('handles missing config gracefully (empty Resource)', () => {
    const result = buildResources([{ name: 'bare', icon: null, menuGroup: 'data' }], {});
    expect(result[0].props.name).toBe('bare');
    expect(result[0].props.list).toBeUndefined();
  });
});
