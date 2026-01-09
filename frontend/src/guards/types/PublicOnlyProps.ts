export interface PublicOnlyProps {
    isAuthenticated: boolean;
    redirectPath?: string;  
    children?: React.ReactNode; 
}