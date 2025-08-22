import useAppQuery from './useAppQuery';
import ProductService from '@/services/product.service';

export function useProductQuery(productId) {
	const {
		data: product,
		isLoading,
		error,
		refetch,
	} = useAppQuery(
		['product', productId],
		() => ProductService.getProductById(productId),
		{
			select: (res) => res.data,
		},
		{
			enabled: !!productId,
			staleTime: 5 * 60 * 1000, // 5 phút - thời gian lưu cache
			cacheTime: 10 * 60 * 1000, // 10 phút - thời gian lưu cache
			refetchOnWindowFocus: false,
		},
	);

	return {
		product,
		isLoading,
		error,
		refetch,
	};
}

export function useProductsQuery(page = 1, limit = 10) {
	const { data, isLoading, error, refetch } = useAppQuery(
		['products', page, limit],
		() => ProductService.getAllProducts(page, limit),
		{
			staleTime: 2 * 60 * 1000, // 2 phút
			cacheTime: 5 * 60 * 1000, // 5 phút
		},
	);

	return {
		products: data?.products || [],
		pagination: data?.pagination,
		isLoading,
		error,
		refetch,
	};
}
