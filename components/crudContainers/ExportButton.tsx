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
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

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
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleExport = useCallback(
        format => {
            dataProvider
                .export(resource,
                    {
                        sort,
                        filter: filter
                            ? { ...filterValues, ...filter }
                            : filterValues,
                        pagination: { page: 1, perPage: maxResults },
                    },
                    format,
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

    const handleClick = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    }, [setAnchorEl]);
    const handleClose = useCallback(() => setAnchorEl(null), [setAnchorEl]);
    const handleExportExcel = useCallback(() => (handleClose(), handleExport('excel')), [handleClose, handleExport]);
    const handleExportPdf = useCallback(() => (handleClose(), handleExport('pdf')), [handleClose, handleExport]);

    return <>
        <Button
            onClick={handleClick}
            label={label}
            disabled={total === 0}
            {...sanitizeRestProps(rest)}
        >
            {icon}
        </Button>
        <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
        >
            <MenuItem onClick={handleExportExcel}>Excel</MenuItem>
            <MenuItem onClick={handleExportPdf}>Pdf</MenuItem>
        </Menu>
    </>;
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
