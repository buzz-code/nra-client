import * as React from 'react';
import { useCallback } from 'react';
import PropTypes from 'prop-types';
import DownloadIcon from '@mui/icons-material/GetApp';
import {
    useDataProvider,
    useNotify,
    useListContext,
    SortPayload,
    FilterPayload,
    useResourceContext,
    useGetResourceLabel,
} from 'ra-core';
import { Button, ButtonProps } from 'react-admin';

export const ExportButton = (props: ExportButtonProps) => {
    const {
        maxResults = 1000,
        onClick,
        label = 'ra.action.export',
        icon = defaultIcon,
        ...rest
    } = props;
    const {
        filter,
        filterValues,
        sort,
        total,
    } = useListContext(props);
    const resource = useResourceContext(props);
    const dataProvider = useDataProvider();
    const getResourceLabel = useGetResourceLabel();
    const notify = useNotify();
    const handleClick = useCallback(
        event => {
            dataProvider
                .export(resource,
                    {
                        sort,
                        filter: filter
                            ? { ...filterValues, ...filter }
                            : filterValues,
                        pagination: { page: 1, perPage: maxResults },
                    },
                    'pdf',
                    // 'excel',
                    getResourceLabel(resource))
                .catch(error => {
                    console.error(error);
                    notify('ra.notification.http_error', { type: 'warning' });
                });
        },
        [
            dataProvider,
            filter,
            filterValues,
            maxResults,
            getResourceLabel,
            notify,
            resource,
            sort,
        ]
    );

    return (
        <Button
            onClick={handleClick}
            label={label}
            disabled={total === 0}
            {...sanitizeRestProps(rest)}
        >
            {icon}
        </Button>
    );
};

const defaultIcon = <DownloadIcon />;

const sanitizeRestProps = ({
    filterValues,
    resource,
    ...rest
}: Omit<ExportButtonProps, 'sort' | 'maxResults' | 'label'>) =>
    rest;

interface Props {
    filterValues?: FilterPayload;
    icon?: JSX.Element;
    label?: string;
    maxResults?: number;
    onClick?: (e: Event) => void;
    resource?: string;
    sort?: SortPayload;
}

export type ExportButtonProps = Props & ButtonProps;

ExportButton.propTypes = {
    filterValues: PropTypes.object,
    label: PropTypes.string,
    maxResults: PropTypes.number,
    resource: PropTypes.string,
    sort: PropTypes.exact({
        field: PropTypes.string,
        order: PropTypes.string,
    }),
    icon: PropTypes.element,
};
