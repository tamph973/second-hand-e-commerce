const BANK_API_URL = 'https://api.vietqr.io/v2/banks';

let cacheBankList = null;

export const getBankList = async () => {
	if (cacheBankList) return cacheBankList;
	const res = await fetch(BANK_API_URL);
	const data = await res.json();
	cacheBankList = data;
	return data;
};
