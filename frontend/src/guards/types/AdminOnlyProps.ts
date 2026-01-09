export interface AdminOnlyProps {
    isAdmin: boolean;
    redirectPath?: string;
    children?: React.ReactNode;
}