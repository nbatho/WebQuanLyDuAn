import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
    Check, Moon, Sun, Monitor, RotateCcw
} from 'lucide-react';
import LanguageSwitcher from '@/components/LanguageSwitcher';

type ThemeMode = 'light' | 'dark' | 'system';

export default function Theme() {
    const { t } = useTranslation('settings');
    const [theme, setTheme] = useState<ThemeMode>(() => {
        return (localStorage.getItem('app_theme') as ThemeMode) || 'light';
    });

    const handleThemeChange = (mode: ThemeMode) => {
        setTheme(mode);
        localStorage.setItem('app_theme', mode);
        // Dispatch custom event so main.tsx ThemedApp picks it up
        window.dispatchEvent(new Event('theme-change'));
    };

    const handleRestartTour = () => {
        localStorage.removeItem('onboarding_completed');
        window.location.reload();
    };

    const themeOptions = [
        {
            id: 'light' as ThemeMode,
            label: t('appearance.light'),
            icon: <Sun size={14} />,
            preview: 'bg-[#f5f7ff]',
            previewInner: 'bg-[var(--color-surface-container-lowest)]',
        },
        {
            id: 'dark' as ThemeMode,
            label: t('appearance.dark'),
            icon: <Moon size={14} />,
            preview: 'bg-[#1a1d23]',
            previewInner: 'bg-[#2a2d35]',
        },
        {
            id: 'system' as ThemeMode,
            label: t('appearance.system'),
            icon: <Monitor size={14} />,
            preview: 'bg-[linear-gradient(135deg,#f5f7ff_50%,#1a1d23_50%)]',
            previewInner: 'bg-[linear-gradient(135deg,#fff_50%,#2a2d35_50%)]',
        },
    ];

    return (
        <div>
            <h2 className="mb-1 text-h2 font-extrabold text-[var(--color-on-surface)]">
                {t('appearance.title')}
            </h2>
            <p className="mb-6 text-body-sm text-[var(--color-text-tertiary)]">
                {t('appearance.subtitle')}
            </p>

            {/* Theme selector */}
            <div className="grid max-w-130 grid-cols-3 gap-4 max-sm:grid-cols-1">
                {themeOptions.map(opt => (
                    <div
                        key={opt.id}
                        className={`cursor-pointer overflow-hidden rounded-xl border-2 transition-all duration-150 ${theme === opt.id
                            ? 'border-[var(--color-primary)] shadow-[0_0_0_3px_rgba(0,88,190,0.12)]'
                            : 'border-[var(--color-border-light)] hover:border-[var(--color-outline)]'
                            }`}
                        onClick={() => handleThemeChange(opt.id)}
                    >
                        <div className={`flex h-20 p-1.5 ${opt.preview}`}>
                            <div className={`mr-1 w-[30%] rounded ${opt.previewInner}`} />
                            <div className={`flex-1 rounded ${opt.previewInner}`} />
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-2.5 text-body-sm font-bold text-[var(--color-on-surface)]">
                            {opt.icon} {opt.label}
                            {theme === opt.id && <Check size={14} className="ml-auto text-[var(--color-primary)]" />}
                        </div>
                    </div>
                ))}
            </div>

            {/* Language selector */}
            <div className="mt-8 max-w-130">
                <h3 className="mb-1 text-h4 font-bold text-[var(--color-on-surface)]">
                    {t('appearance.language')}
                </h3>
                <p className="mb-3 text-body-sm text-[var(--color-text-tertiary)]">
                    {t('appearance.languageDesc')}
                </p>
                <LanguageSwitcher />
            </div>

            {/* Restart onboarding tour */}
            <div className="mt-8 max-w-130 border-t border-[var(--color-border-light)] pt-6">
                <button
                    type="button"
                    className="flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-transparent px-4 py-2.5 text-body-sm font-semibold text-[var(--color-text-secondary)] transition-all hover:bg-[var(--color-primary-bg)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)]"
                    onClick={handleRestartTour}
                >
                    <RotateCcw size={16} />
                    {t('restartTour')}
                </button>
            </div>
        </div>
    )
}
