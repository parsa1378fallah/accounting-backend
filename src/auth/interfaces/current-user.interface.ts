export interface CurrentUser {
    id: string;
    email: string;
    organizationId: string | null;
    roles: string[];
    permissions: string[];
}