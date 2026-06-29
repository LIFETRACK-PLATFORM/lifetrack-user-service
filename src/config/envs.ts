import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  NATS_SERVERS: string[];
  MONGO_URL: string;
}

const envsSchema = joi
  .object({
    NATS_SERVERS: joi.array().items(joi.string()).required(),
    MONGO_URL: joi.string().required(),
  })
  .unknown(true);

const { error, value } = envsSchema.validate({
  ...process.env,
  NATS_SERVERS: process.env.NATS_SERVERS?.split(','),
}) as { error: joi.ValidationError | undefined; value: EnvVars };

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value;

export const envs = {
  natsServers: envVars.NATS_SERVERS,
  mongoUrl: envVars.MONGO_URL,
};
