import { Box, Typography } from '@mui/material';
import { Button, useGetResourceLabel, useListContext, useResourceContext, useTranslate } from 'react-admin';
import SearchOffOutlinedIcon from '@mui/icons-material/SearchOffOutlined';

// Datagrid's default `empty` (ListNoResults) is a single plain sentence with
// no visual weight - easy to miss in a mostly-white page. This keeps the same
// filtered-vs-empty logic and translation keys, just with an icon and centered
// layout so an empty grid reads as an intentional state, not a rendering bug.
export const CommonEmpty = () => {
    const translate = useTranslate();
    const resource = useResourceContext();
    const { filterValues, setFilters } = useListContext();
    const getResourceLabel = useGetResourceLabel();
    const hasFilters = filterValues && setFilters && Object.keys(filterValues).length > 0;

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 1,
                py: 8,
                px: 2,
                color: 'text.secondary',
                textAlign: 'center',
            }}
        >
            <SearchOffOutlinedIcon sx={{ fontSize: 40, color: 'text.disabled' }} />
            <Typography variant="body2">
                {hasFilters
                    ? translate('ra.navigation.no_filtered_results', {
                          resource,
                          name: getResourceLabel(resource, 0),
                          _: 'No results found with the current filters.',
                      })
                    : translate('ra.navigation.no_results', {
                          resource,
                          name: getResourceLabel(resource, 0),
                          _: 'No results found.',
                      })}
            </Typography>
            {hasFilters && (
                <Button
                    onClick={() => setFilters({}, [])}
                    label={translate('ra.navigation.clear_filters', { _: 'Clear filters' })}
                />
            )}
        </Box>
    );
};

export default CommonEmpty;
