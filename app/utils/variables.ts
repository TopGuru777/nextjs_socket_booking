const { env } = process as { env: { [key: string]: string } };

export const { BASE_API, AUTH_TOKEN } = env;
