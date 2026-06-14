/**
 * Base class for domain HTTP errors. Services throw these; only the global
 * exception middleware turns them into an HTTP response. Layers never touch res.
 */
export class HttpException extends Error {
    constructor(
        public readonly status: number,
        message: string,
        public readonly error?: string,
    ) {
        super(message);
        this.name = new.target.name;
    }
}

/** 400 invalid input or a domain rule violation, e.g. an illegal status transition. */
export class BadRequestException extends HttpException {
    constructor(message = 'Bad Request', error?: string) {
        super(400, message, error);
    }
}

/** 404 the requested resource does not exist or is soft-deleted. */
export class NotFoundException extends HttpException {
    constructor(message = 'Not Found', error?: string) {
        super(404, message, error);
    }
}

/** 409 the request conflicts with current state. Reserved for future concurrency use. */
export class ConflictException extends HttpException {
    constructor(message = 'Conflict', error?: string) {
        super(409, message, error);
    }
}
