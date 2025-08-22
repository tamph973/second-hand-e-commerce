import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Export ToastContainer cấu hình sẵn
export const CustomToastContainer = () => (
	<ToastContainer
		position='top-right'
		autoClose={3000}
		hideProgressBar={false}
		newestOnTop
		closeOnClick
		rtl={false}
		draggable
		theme='light'
		transition={Slide}
	/>
);

// Gói showToast cho gọn
export const showToast = (message, type = 'success', options = {}) => {
	const toastTypes = {
		success: () => toast.success(message, options),
		error: () => toast.error(message, options),
		info: () => toast.info(message, options),
		warning: () => toast.warning(message, options),
		default: () => toast(message, options),
	};

	(toastTypes[type] || toastTypes.default)();
};
