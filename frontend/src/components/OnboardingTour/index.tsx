import { useEffect, useCallback, useRef } from 'react';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import './onboarding.css';
import { useTranslation } from 'react-i18next';
import { getTourSteps } from './tourSteps';

const STORAGE_KEY = 'onboarding_completed';

export function useOnboardingTour() {
    const { t } = useTranslation();
    const driverRef = useRef<ReturnType<typeof driver> | null>(null);

    const createDriver = useCallback(() => {
        const driverObj = driver({
            showProgress: true,
            animate: true,
            overlayColor: 'rgba(0, 0, 0, 0.6)',
            stagePadding: 8,
            stageRadius: 12,
            popoverClass: 'flowise-tour-popover',
            nextBtnText: t('onboarding.next', 'Next'),
            prevBtnText: t('onboarding.prev', 'Previous'),
            doneBtnText: t('onboarding.done', 'Done'),
            progressText: '{{current}} / {{total}}',
            steps: getTourSteps(t),
            onDestroyStarted: () => {
                localStorage.setItem(STORAGE_KEY, 'true');
                driverObj.destroy();
            },
        });

        return driverObj;
    }, [t]);

    useEffect(() => {
        const completed = localStorage.getItem(STORAGE_KEY);
        if (completed) return;

        const timer = setTimeout(() => {
            const driverObj = createDriver();
            driverRef.current = driverObj;
            driverObj.drive();
        }, 1500);

        return () => {
            clearTimeout(timer);
            driverRef.current?.destroy();
        };
    }, [createDriver]);

    const restartTour = useCallback(() => {
        localStorage.removeItem(STORAGE_KEY);
        driverRef.current?.destroy();

        const driverObj = createDriver();
        driverRef.current = driverObj;
        driverObj.drive();
    }, [createDriver]);

    return { restartTour };
}
