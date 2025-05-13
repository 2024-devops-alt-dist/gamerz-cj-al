import dotenv from 'dotenv';

dotenv.config();

interface Config {
    dbUser: string;
    dbPassword: string;
    dbName: string;
    dbHost: string;
    dbCluster: string;
    uri: string;
    accessSecret: string;
    refreshSecret: string;
    port: number;
}

function getEnvVar(key: string, defaultValue?: string): string {
  const value = process.env[key] || defaultValue;
  if (!value) {
    throw new Error(`Missing environement variable ${key}.`);
  }
  return value;
}

const config: Config = {
  dbUser : getEnvVar('DB_USER'),
  dbPassword: getEnvVar('DB_PASSWORD'),
  dbName: getEnvVar('DB_NAME'),
  dbHost: getEnvVar('DB_HOST'),
  dbCluster: getEnvVar('DB_CLUSTER'),
  uri: `mongodb+srv://${getEnvVar('DB_USER')}:${getEnvVar('DB_PASSWORD')}@${getEnvVar('DB_HOST')}/${getEnvVar('DB_NAME')}?retryWrites=true&w=majority&appName=${getEnvVar('DB_CLUSTER')}`,
  accessSecret: getEnvVar('JWT_ACCESS_SECRET'),
  refreshSecret: getEnvVar('JWT_REFRESH_SECRET'),
  port: process.env.PORT ? parseInt(process.env.PORT) : 3000
};

export default config;