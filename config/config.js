const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');

dotenv.config({ path: path.join(__dirname, '../.env') });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'dev', 'test').required(),
    PORT: Joi.number().default(3000),
    MONGODB_URL: Joi.string().description('Mongo DB url'),
    JWT_SECRET: Joi.string().required().description('JWT secret key'),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(30).description('minutes after which access tokens expire'),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(30).description('days after which refresh tokens expire'),
    JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('minutes after which reset password token expires'),
    JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('minutes after which verify email token expires'),
    JWT_CHANNEL_INVITE_EXPIRATION_MINUTES: Joi.number()
      .default(1440)
      .description('minutes after which channel invite token expires'),
    SMTP_HOST: Joi.string().description('server that will send the emails'),
    SMTP_PORT: Joi.number().description('port to connect to the email server'),
    SMTP_USERNAME: Joi.string().description('username for email server'),
    SMTP_PASSWORD: Joi.string().description('password for email server'),
    EMAIL_FROM: Joi.string().description('the from field in the emails sent by the app'),
    VERIFY_DOMAIN: Joi.string(),
    CORS: Joi.boolean().default(false),
    CORS_WHITELIST: Joi.string().default('[]'),
    BYPASS_VERIFY_EMAIL: Joi.boolean().default(false),
    WEBRTC_ANNOUNCE_IP: Joi.string().default('127.0.0.1'),
    ENABLE_MEDIASOUP: Joi.boolean().default(false),
    MESSAGE_RETENTION: Joi.number().default(30),
    APP_NAME: Joi.string().default('APP'),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  mongoose: {
    url: envVars.MONGODB_URL + (envVars.NODE_ENV === 'test' ? '-test' : ''),
    options: {
      // useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes: envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
    verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
    channelInviteExpirationMinutes: envVars.JWT_CHANNEL_INVITE_EXPIRATION_MINUTES
  },
  email: {
    smtp: {
      host: envVars.SMTP_HOST,
      port: envVars.SMTP_PORT,
      auth: {
        user: envVars.SMTP_USERNAME,
        pass: envVars.SMTP_PASSWORD,
      },
    },
    verifyDomain: envVars.VERIFY_DOMAIN,
    from: envVars.EMAIL_FROM,
  },
  cors: envVars.CORS,
  corsWhitelist: JSON.parse(envVars.CORS_WHITELIST),
  bypassVerifyEmail: envVars.BYPASS_VERIFY_EMAIL,
  webRTCAnnounceIp: envVars.WEBRTC_ANNOUNCE_IP,
  enableMediasoup: envVars.ENABLE_MEDIASOUP,
  messageRetention: envVars.MESSAGE_RETENTION,
  appName: envVars.APP_NAME,
};
