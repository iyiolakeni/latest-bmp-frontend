export interface SidebarItem {
    icon: string;
    text: string;
    route: string;
    caret?: string;
    children?: SidebarItem[]
}