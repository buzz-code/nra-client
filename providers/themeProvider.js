import { defaultTheme } from 'react-admin';

const theme = {
    ...defaultTheme,
    direction: 'rtl',
    isRtl: true,
    palette: {
        type: "light"
    },
    // components: {
    //     ...defaultTheme.components,
    //     RaLayout: {
    //         styleOverrides: {
    //             root: {
    //                 "& .RaLayout-appFrame": {
    //                     maxWidth: '100vw',
    //                     overflow: 'auto',
    //                 },
    //             }
    //         }
    //     }
    // }
};

export default theme;