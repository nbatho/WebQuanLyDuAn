import type { SpaceItem } from '../types';

/** Tên list (ưu tiên) hoặc folder để hiển thị sau tên space trong breadcrumb. */
export function resolveSpaceBreadcrumbSegment(
    spaces: SpaceItem[],
    spaceId: string,
    listId: string | null,
    folderId: string | null,
): string | null {
    const space = spaces.find((s) => s.id === spaceId);
    if (!space) return null;

    if (listId) {
        for (const f of space.folders) {
            const hit = f.lists.find((l) => l.id === listId);
            if (hit) return hit.name;
        }
        const root = space.lists.find((l) => l.id === listId);
        if (root) return root.name;
    }

    if (folderId) {
        const fd = space.folders.find((f) => f.id === folderId);
        if (fd) return fd.name;
    }

    return null;
}
