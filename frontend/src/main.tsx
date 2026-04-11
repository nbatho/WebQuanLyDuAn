import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ConfigProvider } from 'antd'
import { Provider } from 'react-redux'
import { store } from './store/configureStore'
import GlobalStyles from './components/GlobalStyles'
import App from './App.tsx'
import './index.css'

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
            <ConfigProvider
                theme={{
                    token: {
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
                        borderRadius: 8,
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        boxShadow: 'none',
                        boxShadowSecondary: 'none',
                        boxShadowTertiary: 'none',
                    },
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
        </GlobalStyles>
    </StrictMode>
);