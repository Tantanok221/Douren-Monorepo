import { createStitches } from '@stitches/react';

export const {
    styled,
    css,
    globalCss,
    keyframes,
    getCssText,
    theme,
    createTheme,
    config,
} = createStitches({
    theme: {
        colors: {
            background: '#111',
            day: '#cbc3c3',
            link: '#cbc3c3',
            linkPanel: '#3c3c3c',
            numberTag: '#838181',
            numberTagBackground: '#3c3c3c',
            panel: '#1f1f21',
            tagBackground: '#464646',
            tagText: '#aaaaaa',
            white: '#ffffff',
            onHover: '#4d4d4d',
            sidebarBg: '#1d1d1d',
            sidebarActive: '#292929',
            stroke: '#3c3c3c',
        },
        fonts: {
            default: 'Noto Sans TC',
        },
    },
    utils: {
        // Add any custom utils here
    },
});

export const globalStyles = globalCss({
    'html, body': {
        margin: 0,
        padding: 0,
    },
    body: {
        backgroundColor: '$background',
        fontSize: '16px',
    },
    html: {
        fontSize: '13px',
        scrollBehavior: 'smooth',
    },
    '*': {
        minWidth: '0px',
        boxSizing: 'border-box',
    },
    '*::before, *::after': {
        minWidth: '0px',
        boxSizing: 'border-box',
    },
});

// Function to initialize global styles
export const initializeGlobalStyles = () => {
    globalStyles();
};