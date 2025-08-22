import useAppQuery from './useAppQuery';
import {
	fetchProvinces,
	fetchDistricts,
	fetchWards,
} from '@/configs/addressAPI';

export function useAddressQuery(provinceCode, districtCode) {
	const { data: provinces = [], ...restProvinces } = useAppQuery(
		['provinces'],
		fetchProvinces,
	);
	const { data: districts = [], ...restDistricts } = useAppQuery(
		['districts', provinceCode],
		() => fetchDistricts(provinceCode),
		{ enabled: !!provinceCode },
	);
	const { data: wards = [], ...restWards } = useAppQuery(
		['wards', districtCode],
		() => fetchWards(districtCode),
		{ enabled: !!districtCode },
	);
	return {
		provinces,
		districts,
		wards,
		...restProvinces,
		...restDistricts,
		...restWards,
	};
}
