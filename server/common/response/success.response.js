import { HttpMessage } from './httpMessage.js';
import { HttpStatusCode } from './httpStatusCode.js';

class SuccessResponse {
	constructor({ message, status, data = {} }) {
		this.message = message;
		this.status = status;
		this.data = data;
	}
	send(res, headers = {}) {
		Object.entries(headers).forEach(([key, value]) => {
			res.setHeader(key, value);
		});
		return res.status(this.status).json(this);
	}
}

class Ok extends SuccessResponse {
	constructor(message = HttpMessage.OK, status = HttpStatusCode.OK, data = {}) {
		super({ message, data, status });
	}
	send(res, headers = {}) {
		return res.status(this.status).json(this.message);
	}
}

class Created extends SuccessResponse {
	constructor(message = HttpMessage.CREATED, status = HttpStatusCode.CREATED, data = {}) {
		super({ message, data, status });
	}
	send(res, headers = {}) {
		return res.status(this.status).json(this.message);
	}
}

const Success = { Ok, Created };

export default Success;
