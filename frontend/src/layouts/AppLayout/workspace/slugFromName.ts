/** Backend slug: lowercase letters, numbers, single hyphens between segments. */
export function workspaceSlugFromName(name: string): string {
    const base = name
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    return base.length > 0 ? base : 'workspace';
}
