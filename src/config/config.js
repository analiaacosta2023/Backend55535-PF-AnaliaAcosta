import dotenv from 'dotenv'

dotenv.config()

export default {
    port: process.env.PORT,
    mongoUrl: process.env.MONGO_URL,
    adminEmail: process.env.ADMIN_EMAIL,
    adminPassword: process.env.ADMIN_PASSWORD,
    persistence: process.env.PERSISTENCE,
    environment: process.env.ENVIRONMENT,
    restartPassKey: process.env.RESTART_PASS_KEY,
    jwtSecret: process.env.JWT_SECRET,
    appUrl: process.env.APP_URL,
    gitClientId: process.env.GIT_CLIENT_ID,
    gitClientSecret: process.env.GIT_CLIENT_SECRET
}