export type ClubStatus = 'PUBLISHED' | 'DRAFT' | 'ARCHIVED' | 'SUSPENDED';

export interface Club {
    name: string;
    slug: string;
    description?: string;
    imgUrl?: string;
    status: ClubStatus;
    isActive: boolean;
    sportSlug: string;
}
