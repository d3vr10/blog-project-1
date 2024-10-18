import winston, {transports} from "winston";

export const logger = winston.createLogger({
    defaultMeta: { },
    transports: [
    ],

})


if (process.env.NODE_ENV !== 'production') {
    logger.add(new transports.Console({
        level: "info",
        format: winston.format.colorize(),
    }))
}