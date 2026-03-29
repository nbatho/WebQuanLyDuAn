import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ConfigProvider } from 'antd'
import { Provider } from 'react-redux'
import { store } from './store/configureStore'
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
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: '#0058be',
                    borderRadius: 6,
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
                },
            }}
        >
            <Provider store={store}>
                <App />
            </Provider>
        </ConfigProvider>
    </StrictMode>
);