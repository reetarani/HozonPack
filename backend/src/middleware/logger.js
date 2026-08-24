export const logger = (req, res, next) => {
    console.log("Request received");
    next();
};