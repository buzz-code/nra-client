import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// Generic collapsed-by-default section: a title in the summary, anything in the details.
// For a settings-page section with an optional subtitle and larger (h6) title, use
// CommonSettingsAccordion instead - this one is for lighter-weight uses (instructions,
// an optional/advanced sub-form, a "details" panel) that don't need that shape.
// `id` is optional - pass one when rendering a list of these, so each gets its own
// aria-controls/aria-labelledby pairing instead of sharing generated ones.
// `summarySx`/`detailsSx` are optional - pass them to style the summary/details slots
// themselves (e.g. a compact inline layout), separately from `sx` on the outer Accordion.
// `titleColor` is optional - pass a Typography `color` value (e.g. "text.secondary") to
// style the title text itself.
export function CollapsibleSection({
    title, titleVariant = 'body2', titleColor, id, summarySx, detailsSx, children, ...accordionProps
}) {
    return (
        <Accordion {...accordionProps}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={summarySx}
                {...(id ? { id: `${id}-header`, 'aria-controls': `${id}-content` } : {})}
            >
                <Typography variant={titleVariant} color={titleColor}>{title}</Typography>
            </AccordionSummary>
            <AccordionDetails sx={detailsSx}>{children}</AccordionDetails>
        </Accordion>
    );
}

export default CollapsibleSection;
