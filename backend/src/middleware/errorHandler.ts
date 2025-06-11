import type {
    Request,
    Response,
    NextFunction,
    ErrorRequestHandler,
} from "express";

interface CustomError extends Error {
    name: string;
    code?: number;
    statusCode?: number;
    status?: number;
}

export const errorHandler: ErrorRequestHandler = (
    err: CustomError,
    req: Request,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: NextFunction
) => {
    console.error("Error:", {
        message: err.message,
        stack: err.stack,
        name: err.name,
        code: err.code,
        url: req.url,
        method: req.method,
        timestamp: new Date().toISOString(),
    });

    // MongoDB CastError (invalid ObjectId)
    if (err.name === "CastError") {
        res.status(400).json({
            error: "Invalid ID format",
            message: "The provided ID is not a valid format",
        });
        return;
    }

    // MongoDB ValidationError
    if (err.name === "ValidationError") {
        res.status(400).json({
            error: "Validation Error",
            message: err.message,
        });
        return;
    }

    // MongoDB duplicate key error
    if (err.code === 11000) {
        res.status(409).json({
            error: "Duplicate entry",
            message: "A record with this information already exists",
        });
        return;
    }

    // JSON parsing error
    if (err.name === "SyntaxError" && "body" in err) {
        res.status(400).json({
            error: "Invalid JSON",
            message: "Request body contains invalid JSON",
        });
        return;
    }

    // Custom status code errors
    const statusCode = err.statusCode ?? err.status ?? 500;

    if (statusCode < 500) {
        res.status(statusCode).json({
            error: err.message || "Bad Request",
        });
        return;
    }

    // Default server error
    res.status(500).json({
        error: "Internal server error",
        message:
            process.env.NODE_ENV === "development"
                ? err.message
                : "Something went wrong",
    });
};
