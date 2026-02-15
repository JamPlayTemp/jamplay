export interface AppConfig {
  port: number;
}

export function getAppConfig(): AppConfig {
  return {
    port: 3000,
  };
}
