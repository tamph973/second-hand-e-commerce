import { useMutation } from '@tanstack/react-query';

export const useAppMutation = ({
	mutationFn,
	onSuccess,
	onError,
	onSettled,
}) => {
	return useMutation({
		mutationFn,
		onSuccess: (res, ...args) => {
			if (onSuccess) onSuccess(res, ...args);
		},
		onError: (err, ...args) => {
			if (onError) onError(err, ...args);
		},
		onSettled,
	});
};
