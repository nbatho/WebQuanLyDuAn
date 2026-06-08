import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { ConfigProvider, theme as antdTheme } from 'antd'
import viVN from 'antd/locale/vi_VN'
import enUS from 'antd/locale/en_US'
import { Provider } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { store } from './store/configureStore'
import GlobalStyles from './components/GlobalStyles'
import App from './App.tsx'
import './i18n'
import './index.css'

type ThemeMode = 'light' | 'dark' | 'system';

function getInitialTheme(): ThemeMode {
    return (localStorage.getItem('app_theme') as ThemeMode) || 'light';
}

function applyThemeClass(mode: ThemeMode) {
    const root = document.documentElement;
    if (mode === 'system') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        root.classList.toggle('dark', prefersDark);
    } else {
        root.classList.toggle('dark', mode === 'dark');
    }
}

const antdLocaleMap: Record<string, typeof viVN> = {
    vi: viVN,
    en: enUS,
};

/* ─── Shared base tokens ─── */
const baseTokens = {
    borderRadius: 8,
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    boxShadow: 'none',
    boxShadowSecondary: 'none',
    boxShadowTertiary: 'none',
    // ── Typography Scale — mirror của CSS vars trong GlobalStyles.css ──
    // --text-body: 14px (base)
    fontSize: 14,
    // --text-body-sm: 13px
    fontSizeSM: 13,
    // --text-body-lg: 15px
    fontSizeLG: 15,
    // --text-h3: 17px
    fontSizeXL: 17,
    // Heading scale
    fontSizeHeading1: 24,  // --text-h1
    fontSizeHeading2: 20,  // --text-h2
    fontSizeHeading3: 17,  // --text-h3
    fontSizeHeading4: 15,  // --text-h4
    fontSizeHeading5: 14,  // --text-body
    // Line heights
    lineHeight: 1.571,          // ~22px at 14px
    lineHeightLG: 1.6,
    lineHeightSM: 1.538,        // ~20px at 13px
    lineHeightHeading1: 1.333,
    lineHeightHeading2: 1.4,
    lineHeightHeading3: 1.412,
};

/* ─── Light theme tokens ─── */
const lightTokens = {
    ...baseTokens,
    colorPrimary: '#0058be',
    colorError: '#ba1a1a',
    colorText: '#141b2b',
    colorTextSecondary: '#5f6368',
    colorTextTertiary: '#9aa0a6',
    colorBorder: '#c2c6d6',
    colorBorderSecondary: '#eef0f5',
    colorBgContainer: '#ffffff',
    colorBgElevated: '#ffffff',
    colorBgLayout: '#f9f9ff',
};

/* ─── Dark theme tokens ─── */
const darkTokens = {
    ...baseTokens,
    colorPrimary: '#6ea8ff',
    colorError: '#ff6b6b',
    colorText: '#e8eaf6',
    colorTextSecondary: '#a0a4b8',
    colorTextTertiary: '#6b6f85',
    colorBorder: '#3a3d52',
    colorBorderSecondary: '#252838',
    colorBgContainer: '#1e2030',
    colorBgElevated: '#252838',
    colorBgLayout: '#111320',
};

function ThemedApp() {
    const { i18n } = useTranslation();
    const [themeMode, setThemeMode] = useState<ThemeMode>(getInitialTheme);

    // Apply dark/light class on mount and when theme changes
    useEffect(() => {
        applyThemeClass(themeMode);
    }, [themeMode]);

    // Listen for system theme changes when mode is 'system'
    useEffect(() => {
        if (themeMode !== 'system') return;
        const mql = window.matchMedia('(prefers-color-scheme: dark)');
        const handler = () => applyThemeClass('system');
        mql.addEventListener('change', handler);
        return () => mql.removeEventListener('change', handler);
    }, [themeMode]);

    // Listen for theme changes from Settings page
    useEffect(() => {
        const handleStorageChange = () => {
            const newTheme = getInitialTheme();
            setThemeMode(newTheme);
        };
        window.addEventListener('theme-change', handleStorageChange);
        return () => window.removeEventListener('theme-change', handleStorageChange);
    }, []);

    const isDark = themeMode === 'dark' ||
        (themeMode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    const currentLocale = antdLocaleMap[i18n.language] || viVN;

    return (
        <ConfigProvider
            locale={currentLocale}
            theme={{
                algorithm: isDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
                token: isDark ? darkTokens : lightTokens,
                components: {
                    Button: {
                        boxShadow: 'none',
                        primaryShadow: 'none',
                        dangerShadow: 'none',
                        defaultShadow: 'none',
                    },
                    Modal: {
                        borderRadiusLG: 12,
                        paddingContentHorizontalLG: 24,
                    },
                    Input: {
                        borderRadius: 8,
                    },
                    Dropdown: {
                        borderRadiusLG: 8,
                    },
                },
            }}
        >
            <Provider store={store}>
                <App />
            </Provider>
        </ConfigProvider>
    );
}

const container = document.getElementById('root');

if (!container) {
    throw new Error(
        "Root element with ID 'root' was not found in the document.",
    );
}

const root = createRoot(container);
root.render(
    <StrictMode>
        <GlobalStyles>
            <ThemedApp />
        </GlobalStyles>
    </StrictMode>
);