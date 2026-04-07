export interface ListItem {
    id: string;
    name: string;
}

export interface FolderItem {
    id: string;
    name: string;
    expanded: boolean;
    lists: ListItem[];
}

export interface SpaceItem {
    id: string;
    name: string;
    expanded: boolean;
    folders: FolderItem[];
    lists: ListItem[];
    color: string;
}
