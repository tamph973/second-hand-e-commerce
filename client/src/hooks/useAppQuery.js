import { useQuery } from '@tanstack/react-query';

export default function useAppQuery(queryKey, queryFn, options) {
	return useQuery({
		queryKey,
		queryFn,
		...options,
	});
}
