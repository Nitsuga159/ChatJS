const ENVS = {
  JWT_USER_SECRET: String(process.env.JWT_USER_SECRET),
  JWT_MAIL_SECRET: String(process.env.JWT_MAIL_SECRET),
  JWT_NOTIFICATION_SECRET: String(process.env.JWT_NOTIFICATION_SECRET),
  MAIL_ADDRESS: String(process.env.MAIL_ADDRESS),
  MAIL_PASSWORD: String(process.env.MAIL_PASSWORD),
};

export default ENVS;
