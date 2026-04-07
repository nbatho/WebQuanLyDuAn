import type { SpaceItem } from '../types';

export const initialSpaces: SpaceItem[] = [
    {
        id: 'marketing-space',
        name: 'Marketing Space',
        expanded: true,
        color: '#e84393',
        folders: [
            {
                id: 'q1-campaign',
                name: 'Q1 Campaign',
                expanded: true,
                lists: [
                    { id: 'social-media', name: 'Social Media' },
                    { id: 'email-marketing', name: 'Email Marketing' },
                ],
            },
        ],
        lists: [{ id: 'brand-identity', name: 'Brand Identity' }],
    },
    {
        id: 'development-space',
        name: 'Development Space',
        expanded: false,
        color: '#0984e3',
        folders: [
            {
                id: 'sprint-1',
                name: 'Sprint 1',
                expanded: false,
                lists: [
                    { id: 'frontend-tasks', name: 'Frontend Tasks' },
                    { id: 'backend-tasks', name: 'Backend Tasks' },
                ],
            },
        ],
        lists: [],
    },
    {
        id: 'design-space',
        name: 'Design Space',
        expanded: false,
        color: '#00b894',
        folders: [],
        lists: [
            { id: 'ui-components', name: 'UI Components' },
            { id: 'research', name: 'Research' },
        ],
    },
];
