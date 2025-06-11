import morgan from "morgan";
import type { Request, Response, RequestHandler } from "express";

// Morgan middleware for logging
export const morganMiddleware: RequestHandler = morgan(
    (tokens, req: Request, res: Response) => {
        const method = tokens.method?.(req, res) ?? "UNKNOWN METHOD";
        const url = tokens.url?.(req, res) ?? "UNKNOWN URL";
        const status = tokens.status?.(req, res) ?? "UNKNOWN STATUS";
        const responseTime =
            tokens["response-time"]?.(req, res) ?? "UNKNOWN RESPONSE TIME";
        const date = tokens.date?.(req, res) ?? new Date().toISOString();

        let logLine = `[${date}] ${method} ${url} ${status} - ${responseTime} ms`;

        if (
            req.method === "POST" ||
            req.method === "PUT" ||
            req.method === "PATCH"
        ) {
            logLine += ` - Body: ${JSON.stringify(req.body)}`;
        }

        return logLine;
    }
);
