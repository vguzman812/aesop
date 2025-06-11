import type { Request, Response, NextFunction, RequestHandler } from "express";

/**
 * Error handler wrapper for async routes
 */
export const asyncHandler = (fn: RequestHandler): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
