export interface JwtPayload {
    sub: string;
    email: string;
    orgId: string;
    roles: string[]
}