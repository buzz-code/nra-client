import { useEffect, useMemo } from 'react';
import { useLocale } from 'react-admin';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { prefixer } from 'stylis';
import rtlPlugin from 'stylis-plugin-rtl';

// Makes direction (RTL/LTR) follow the currently selected locale, instead of
// the `isRtl: true` AdminAppShell always bakes into the theme it hands to
// <Admin>. Has to live *inside* <Admin> - useLocale() only works inside the
// i18n context react-admin creates there, which is below where AdminAppShell
// builds that theme and where RTLStyle sets up its Emotion cache. So instead
// of changing either of those, this wraps the two places that actually
// render visible screens (Layout, LoginPage) with a locally-overriding
// ThemeProvider + CacheProvider - both support nesting, and the innermost
// one wins for everything inside it.
const DirectionalThemeProvider = ({ children }) => {
    const locale = useLocale();
    const isRtl = locale === 'he'; // anything else (en, or a future locale) falls back to ltr
    const outerTheme = useTheme();

    const theme = useMemo(
        () => createTheme(outerTheme, { direction: isRtl ? 'rtl' : 'ltr' }),
        [outerTheme, isRtl],
    );

    // Separate cache key from RTLStyle's 'muirtl' so the two never fight over
    // the same <style> tag; only the stylis plugins need to change with isRtl.
    const cache = useMemo(() => createCache({
        key: 'radir',
        stylisPlugins: isRtl ? [prefixer, rtlPlugin] : [prefixer],
    }), [isRtl]);

    // MUI's theme.direction only affects MUI components that read it directly
    // (Drawer anchor, Menu positioning, etc.) - native browser behavior
    // (scrollbar side, form control alignment) follows the actual dir
    // attribute, which is a separate thing to keep in sync.
    useEffect(() => {
        document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
        document.documentElement.lang = locale;
    }, [isRtl, locale]);

    return (
        <CacheProvider value={cache}>
            <ThemeProvider theme={theme}>{children}</ThemeProvider>
        </CacheProvider>
    );
};

export default DirectionalThemeProvider;
