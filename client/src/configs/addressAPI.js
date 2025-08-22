const PROVINCES_URL = 'https://provinces.open-api.vn/api/v1';

// Lấy danh sách tất cả Tỉnh/Thành phố
export const fetchProvinces = async () => {
	const res = await fetch(`${PROVINCES_URL}/p`);

	return res.json();
};

// Lấy danh sách tất cả Quận/Huyện theo Tỉnh/Thành phố
export const fetchDistricts = async (provinceCode) => {
	const res = await fetch(`${PROVINCES_URL}/p/${provinceCode}?depth=2`);
	const data = await res.json();
	// data.districts là mảng quận/huyện
	return data.districts || [];
};

// Lấy danh sách Phường/Xã theo Quận/Huyện
export const fetchWards = async (districtCode) => {
	const res = await fetch(`${PROVINCES_URL}/d/${districtCode}?depth=2`);
	const data = await res.json();
	// data.wards là mảng phường/xã
	return data.wards || [];
};
