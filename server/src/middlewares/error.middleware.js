import { HttpMessage } from '../common/response/httpMessage.js';
import { HttpStatusCode } from '../common/response/httpStatusCode.js';
import { env } from '../configs/environment.js';

export const errorMiddleware = (err, req, res, next) => {
	if (!err.status) err.status = HttpStatusCode.INTERNAL_SERVER_ERROR;

	const responseError = {
		status: err.status,
		message: err.message || HttpMessage.INTERNAL_SERVER_ERROR,
		stack: err.stack,
	};

	// console.log('env.BUILD_MODE :>> ', env.BUILD_MODE);
	// Chỉ khi môi trường là dev mới trả về stack trace (Ẩn stack trace trong môi trường production)
	if (env.BUILD_MODE !== 'dev') delete responseError.stack;

	return res.status(responseError.status).json(responseError);
};
