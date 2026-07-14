import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMoreOutlined';

// Every settings section renders as an Accordion with a title. This adds a
// one-line subtitle visible while collapsed, so a user can tell what's in a
// section (and whether it's the one they want) without opening all of them.
export const CommonSettingsAccordion = ({ id, title, subtitle, children, ...props }) => (
    <Accordion sx={{ width: '100%' }} {...props}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls={`${id}-content`} id={`${id}-header`}>
            <Box>
                <Typography variant="h6">{title}</Typography>
                {subtitle && (
                    <Typography variant="body2" color="text.secondary">
                        {subtitle}
                    </Typography>
                )}
            </Box>
        </AccordionSummary>
        <AccordionDetails>{children}</AccordionDetails>
    </Accordion>
);

export default CommonSettingsAccordion;
