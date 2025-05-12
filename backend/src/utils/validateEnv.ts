import { cleanEnv, port, str } from "envalid";

export default cleanEnv(process.env, {
  PORT: port(),
  JWT_KEY: str(),
  DATABASE_URL: str(),
  NODE_ENV: str(),
  REDIS_USERNAME: str(),
  REDIS_PASSWORD: str(),
  REDIS_HOST: str(),
  REDIS_PORT: port(),
});
