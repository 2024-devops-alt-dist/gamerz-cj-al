import dotenv from 'dotenv';

dotenv.config();

interface Config {
    uri: string;
    port: number;
}

const config: Config = {
  uri: process.env.DATABASE_URI || 'mongodb://localhost:5000',
  port: process.env.PORT ? parseInt(process.env.PORT) : 3000
};

export default config;