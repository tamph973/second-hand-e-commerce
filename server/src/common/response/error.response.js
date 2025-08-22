import { HttpMessage } from './httpMessage.js';
import { HttpStatusCode } from './httpStatusCode.js';

export class ErrorResponse extends Error {
	constructor(message, status) {
		super(message);
		this.name = 'ErrorResponse';
		this.status = status;
		Error.captureStackTrace(this, this.constructor); // Ghi lại stack trace để dễ xử lý lỗi (debug)
	}
}
class BadRequestError extends ErrorResponse {
	constructor(
		message = HttpMessage.BAD_REQUEST,
		status = HttpStatusCode.BAD_REQUEST,
	) {
		super(message, status);
	}
}

class UnauthorizedError extends ErrorResponse {
	constructor(
		message = HttpMessage.UNAUTHORIZED,
		status = HttpStatusCode.UNAUTHORIZED,
	) {
		super(message, status);
	}
}

class ForbiddenError extends ErrorResponse {
	constructor(
		message = HttpMessage.FORBIDDEN,
		status = HttpStatusCode.FORBIDDEN,
	) {
		super(message, status);
	}
}

class NotFoundError extends ErrorResponse {
	constructor(
		message = HttpMessage.NOT_FOUND,
		status = HttpStatusCode.NOT_FOUND,
	) {
		super(message, status);
	}
}

class ConflictError extends ErrorResponse {
	constructor(
		message = HttpMessage.CONFLICT,
		status = HttpStatusCode.CONFLICT,
	) {
		super(message, status);
	}
}

class InternalServerError extends ErrorResponse {
	constructor(
		message = HttpMessage.INTERNAL_SERVER_ERROR,
		status = HttpStatusCode.INTERNAL_SERVER_ERROR,
	) {
		super(message, status);
	}
}

class ServiceUnavailableError extends ErrorResponse {
	constructor(
		message = HttpMessage.SERVICE_UNAVAILABLE,
		status = HttpStatusCode.SERVICE_UNAVAILABLE,
	) {
		super(message, status);
	}
}

const Errors = {
	BadRequestError,
	UnauthorizedError,
	ForbiddenError,
	NotFoundError,
	ConflictError,
	InternalServerError,
	ServiceUnavailableError,
};

export default Errors;
