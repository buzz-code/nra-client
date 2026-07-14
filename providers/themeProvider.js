import { defaultTheme } from 'react-admin';
import { alpha } from '@mui/material/styles';

// Font stack is specified up front so every app gets the same modern,
// Hebrew-friendly look; the system fallbacks (Segoe UI/Arial) already render
// well if a consuming app hasn't loaded the Rubik/Assistant webfonts.
const headingFontFamily = '"Rubik", "Segoe UI", Arial, sans-serif';
const bodyFontFamily = '"Assistant", "Segoe UI", Arial, sans-serif';

/**
 * Creates a theme with customizable colors
 * @param {Object} options - Theme customization options
 * @param {string} options.primary - Primary color (default: undefined - uses React Admin default)
 * @param {string} options.secondary - Secondary color (default: undefined - uses React Admin default)
 * @param {string} options.error - Error color (default: undefined - uses React Admin default)
 * @param {string} options.info - Info color (default: undefined - uses React Admin default)
 * @param {string} options.success - Success color (default: undefined - uses React Admin default)
 * @param {string} options.warning - Warning color (default: undefined - uses React Admin default)
 * @param {boolean} options.isRtl - Whether the theme is RTL (default: true)
 * @returns {Object} Customized theme object
 */
export const createTheme = (options = {}) => {
    const {
        primary,
        secondary,
        error,
        info,
        success,
        warning,
        isRtl = true
    } = options;

    return {
        ...defaultTheme,
        direction: isRtl ? 'rtl' : 'ltr',
        isRtl,
        shape: {
            ...defaultTheme.shape,
            borderRadius: 10,
        },
        typography: {
            ...defaultTheme.typography,
            fontFamily: bodyFontFamily,
            h1: { fontFamily: headingFontFamily, fontWeight: 600 },
            h2: { fontFamily: headingFontFamily, fontWeight: 600 },
            h3: { fontFamily: headingFontFamily, fontWeight: 600 },
            h4: { fontFamily: headingFontFamily, fontWeight: 600 },
            h5: { fontFamily: headingFontFamily, fontWeight: 600 },
            h6: { fontFamily: headingFontFamily, fontWeight: 600 },
            button: { fontWeight: 600, textTransform: 'none' },
        },
        palette: {
            type: "light",
            mode: "light",
            ...(primary && { primary: { main: primary } }),
            ...(secondary && { secondary: { main: secondary } }),
            ...(error && { error: { main: error } }),
            ...(info && { info: { main: info } }),
            ...(success && { success: { main: success } }),
            ...(warning && { warning: { main: warning } }),
        },
        components: {
            ...defaultTheme.components,
            RaMenuItemLink: {
                styleOverrides: {
                    root: ({ theme }) => ({
                        borderRadius: theme.shape.borderRadius,
                        marginInline: theme.spacing(1),
                        '&.RaMenuItemLink-active': {
                            backgroundColor: alpha(theme.palette.primary.main, 0.12),
                            color: theme.palette.primary.main,
                        },
                    }),
                },
            },
            MuiCard: {
                styleOverrides: {
                    root: ({ theme }) => ({
                        borderRadius: theme.shape.borderRadius * 1.4,
                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
                    }),
                },
            },
            MuiPaper: {
                styleOverrides: {
                    rounded: ({ theme }) => ({
                        borderRadius: theme.shape.borderRadius * 1.4,
                    }),
                },
            },
            MuiButton: {
                styleOverrides: {
                    root: {
                        boxShadow: 'none',
                    },
                    contained: {
                        boxShadow: 'none',
                        '&:hover': { boxShadow: 'none' },
                    },
                },
            },
            MuiChip: {
                styleOverrides: {
                    root: { borderRadius: 999, fontWeight: 600 },
                },
            },
            MuiTableRow: {
                styleOverrides: {
                    root: ({ theme }) => ({
                        '&.MuiTableRow-hover:hover': {
                            backgroundColor: alpha(theme.palette.primary.main, 0.04),
                        },
                    }),
                },
            },
            MuiTableCell: {
                styleOverrides: {
                    head: {
                        fontWeight: 700,
                    },
                    root: {
                        borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
                    },
                },
            },
            // Datagrid hardcodes its own `.RaDatagrid-headerCell { backgroundColor:
            // background.paper }` (needed to keep the sticky header opaque), which
            // has higher specificity than a plain MuiTableCell override - target
            // the same class so the tint actually wins.
            RaDatagrid: {
                styleOverrides: {
                    root: ({ theme }) => ({
                        '& .RaDatagrid-headerCell': {
                            backgroundColor: alpha(theme.palette.text.primary, 0.03),
                        },
                    }),
                },
            },
            // The default RaLayout-content has no top padding at all, so page
            // content sits flush against the AppBar - add breathing room here
            // once, instead of on every page.
            RaLayout: {
                styleOverrides: {
                    root: ({ theme }) => ({
                        '& .RaLayout-content': {
                            paddingTop: theme.spacing(3),
                        },
                    }),
                },
            },
        },
    };
};

// Default theme for backward compatibility
const theme = createTheme();

export default theme;