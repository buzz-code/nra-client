import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import { alpha } from '@mui/material/styles';
import { createElement, useEffect } from 'react';
import { Title, useDataProvider, useGetResourceLabel, useCreatePath } from 'react-admin';
import { Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { defaultYearFilter } from '@shared/utils/yearFilter';
import ListIcon from '@mui/icons-material/ListOutlined';
import PersonIcon from '@mui/icons-material/PersonOutlined';
import EventIcon from '@mui/icons-material/EventOutlined';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcardOutlined';
import CommentIcon from '@mui/icons-material/CommentOutlined';
import LocationOnIcon from '@mui/icons-material/LocationOnOutlined';
import PeopleIcon from '@mui/icons-material/PeopleOutlined';
import AssignmentIcon from '@mui/icons-material/AssignmentOutlined';
import SchoolIcon from '@mui/icons-material/SchoolOutlined';
import AssessmentIcon from '@mui/icons-material/AssessmentOutlined';
import AddIcon from '@mui/icons-material/AddOutlined';

const iconMap = {
    List: ListIcon,
    Person: PersonIcon,
    Event: EventIcon,
    Gift: CardGiftcardIcon,
    Comment: CommentIcon,
    Location: LocationOnIcon,
    People: PeopleIcon,
    Assignment: AssignmentIcon,
    School: SchoolIcon,
    Assessment: AssessmentIcon,
};

export default ({ dashboardItems = [], children }) => {
    return <Grid container spacing={2}>
        <Title title={"לוח המחוונים"} />
        {dashboardItems.map((item, index) => (
            <Grid item xs={6} md={3} key={index}>
                <DashboardItem {...item} />
            </Grid>
        ))}
        <Grid item xs={6} md={3}>
            <AddCardHint />
        </Grid>
        {children}
    </Grid>
}

// dashboardItems is admin-configurable (Settings -> dashboardItems), so
// adding another card is already possible without any code change - this
// just points users at where to do it instead of leaving the empty grid
// space unexplained.
const AddCardHint = () => (
    <Card
        component={Link}
        to="/settings"
        sx={{
            minHeight: 52,
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
            border: '1px dashed',
            borderColor: 'divider',
            boxShadow: 'none',
            color: 'text.secondary',
            textDecoration: 'none',
            transition: 'border-color 0.2s ease, color 0.2s ease',
            '&:hover': {
                borderColor: 'primary.main',
                color: 'primary.main',
                boxShadow: 'none',
            },
        }}
    >
        <AddIcon fontSize="small" />
        <Typography variant="body2" fontWeight={600}>
            הוספת כרטיס · דרך הגדרות
        </Typography>
    </Card>
);

const DashboardItem = ({ resource, icon = 'List', title, filter = {}, yearFilterType = 'year' }) => {
    const getResourceLabel = useGetResourceLabel();
    const dataProvider = useDataProvider();
    const createPath = useCreatePath();
    const resourcePath = createPath({ resource, type: 'list' });

    const mergedFilter = {
        ...filter,
        ...(yearFilterType === 'year' && { year: defaultYearFilter.year }),
        ...(yearFilterType === 'year:$cont' && { 'year:$cont': defaultYearFilter.year })
    };

    const { mutate, isPending, data } = useMutation({
        mutationFn: () => dataProvider.getCount(resource, { filter: mergedFilter })
    });

    useEffect(() => {
        mutate();
    }, []);

    const IconComponent = iconMap[icon] || iconMap.List;

    return (
        <CardWithIcon
            to={{ pathname: resourcePath, search: filter && Object.keys(filter).length ? 'filter=' + JSON.stringify(mergedFilter) : undefined }}
            icon={IconComponent}
            title={title || getResourceLabel(resource)}
            subtitle={isPending ? <Loading /> : typeof data === 'number' ? data.toLocaleString() : data}
        />
    )
}

const Loading = () => (
    <Box height='2rem' display='flex' alignItems='center' justifyContent='center'>
        <CircularProgress size='1.5rem' />
    </Box>
)

const CardWithIcon = ({ icon, title, subtitle, to, children }) => {
    return (
        <Card
            sx={{
                minHeight: 52,
                display: 'flex',
                flexDirection: 'column',
                flex: '1',
                transition: 'box-shadow 0.2s ease, transform 0.2s ease',
                '&:hover': {
                    boxShadow: '0 8px 24px -8px rgba(0, 0, 0, 0.2)',
                    transform: 'translateY(-2px)',
                },
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
                    }}
                >
                    <Box
                        sx={{
                            width: 44,
                            height: 44,
                            borderRadius: 2,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12),
                            color: 'primary.main',
                        }}
                    >
                        {createElement(icon, { fontSize: 'medium' })}
                    </Box>
                    <Box textAlign="right">
                        <Typography color="textSecondary" variant="body2">{title}</Typography>
                        <Typography variant="h5" component="h2" fontWeight={700}>
                            {subtitle ?? ' '}
                        </Typography>
                    </Box>
                </Box>
            </Link>
            {children && <Divider />}
            {children}
        </Card>
    );
};
