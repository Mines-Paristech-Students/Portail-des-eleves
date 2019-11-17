/**
 * Simple interface to represent a sidebar button.
 */
export interface SidebarButton {
    name: string;
    to: string;
    style?: "primary" | "secondary" | "success" | "warning" | "danger" | "info" | "light" | "dark" | "outline-primary" | "outline-secondary" | "outline-success" | "outline-warning" | "outline-danger" | "outline-info" | "outline-light" | "outline-dark";

    /**
     * A lower order should mean higher in the sidebar.
     */
    order?: number;
}
