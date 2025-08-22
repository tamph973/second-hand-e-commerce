import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CATEGORY_ID = 9000;
const OUTPUT_FILE = path.join(
	__dirname,
	'../../../data/chotot-dienmaydienlanh.json',
);
const LIMIT = 100;
const API_URL = `https://gateway.chotot.com/v1/public/ad-listing?limit=${LIMIT}&protection_entitlement=true&cg=${CATEGORY_ID}&st=s,k&key_param_included=true`;

async function fetchProducts() {
	const { data } = await axios.get(API_URL);
	const products = data.ads.map((ad) => ({
		id: ad.ad_id,
		category_name: ad.category_name,
		name: ad.subject,
		description: ad.body,
		price: ad.price,
		images: ad.images?.map((image) => image) || [],
		thumbnail: ad.images?.[0] || '',
		ward_name: ad.ward_name,
		area_name: ad.area_name,
		region_name: ad.region_name,
		params: ad.params.map((item) => ({
			id: item.id,
			label: item.label,
			value: item.value,
		})),
	}));
	fs.writeFileSync(OUTPUT_FILE, JSON.stringify(products, null, 2), 'utf-8');
	console.log(`Đã lưu ${products.length} sản phẩm!`);
}

fetchProducts();
