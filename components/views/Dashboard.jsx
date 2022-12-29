import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Loading from '@mui/material/LinearProgress';
import { createElement, useEffect } from 'react';
import { Title, useDataProvider, useGetResourceLabel } from 'react-admin';
import { Link } from 'react-router-dom';
import { useMutation } from 'react-query';

export default ({items}) => {
    return <Grid container spacing={2} mt={1}>
        <Grid item xs={12}>
            <Title title={"לוח המחוונים"} />
        </Grid>
        {items.map((item, index) => (
            <Grid item xs={6} md={3} key={index}>
                <DashboardItem {...item} />
            </Grid>
        ))}
    </Grid>
}

const DashboardItem = ({ resource, icon, title }) => {
    // todo: add query options here
    // todo: add default title here
    // todo: add table for dashboard items
    const getResourceLabel = useGetResourceLabel();
    const dataProvider = useDataProvider();
    const { mutate, isLoading, data } = useMutation(
        [resource, 'getCount', {}],
        () => dataProvider.getCount(resource, {})
    );

    useEffect(() => {
        mutate();
    }, []);

    return (
        <CardWithIcon
            to={resource}
            icon={icon}
            title={title || getResourceLabel(resource)}
            subtitle={isLoading ? <Loading /> : data}
        />
    )
}

const CardWithIcon = ({ icon, title, subtitle, to, children }) => {
    return (
        <Card
            sx={{
                minHeight: 52,
                display: 'flex',
                flexDirection: 'column',
                flex: '1',
                '& a': {
                    textDecoration: 'none',
                    color: 'inherit',
                },
            }}
        >
            <Link to={to}>
                <Box
                    sx={{
                        overflow: 'inherit',
                        padding: '16px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        '& .icon': {
                            color: theme =>
                                theme.palette.mode === 'dark'
                                    ? 'inherit'
                                    : '#dc2440',
                        },
                    }}
                >
                    <Box width="3em" className="icon">
                        {createElement(icon, { fontSize: 'large' })}
                    </Box>
                    <Box textAlign="right">
                        <Typography color="textSecondary">{title}</Typography>
                        <Typography variant="h5" component="h2">
                            {subtitle || ' '}
                        </Typography>
                    </Box>
                </Box>
            </Link>
            {children && <Divider />}
            {children}
        </Card>
    );
};
