export const AUTH_CONSTANTS = {
    jwtSecret: process.env.JWT_SECRET || "dev_secret",
    expiresIn: "1d",
    ACCESS_TOKEN_EXPIRES_IN: '15m',
    REFRESH_TOKEN_EXPIRES_IN: '30d',
}