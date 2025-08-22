export const calculateTotalPrice = (items, selected) => {
	return items.reduce((total, seller) => {
		return (
			total +
			seller.products.reduce((sum, product) => {
				return selected[seller.sellerId]?.some(
					(item) =>
						item.productId === product.id &&
						item.variantId === product.variantId,
				)
					? sum + product.amount
					: sum;
			}, 0)
		);
	}, 0);
};

export const getSelectedCartItems = (items, selected) => {
	// Lấy ra các seller có sản phẩm được chọn
	return items
		.map((seller) => {
			const selectedProducts = seller.products.filter((product) =>
				selected[seller.sellerId]?.some(
					(item) =>
						item.productId === product.id &&
						item.variantId === product.variantId,
				),
			);
			if (selectedProducts.length === 0) return null;
			return {
				...seller,
				products: selectedProducts,
			};
		})
		.filter(Boolean);
};
