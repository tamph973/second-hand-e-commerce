import { Link } from 'react-router-dom';

/* eslint-disable react/prop-types */
const VerifyAlert = ({ isVerified }) => {
	if (isVerified) return null;
	return (
		<div
			className={`bg-red-50 border border-red-300 text-red-700 rounded-2xl px-5 py-3 flex items-center gap-2 font-semibold`}>
			<span>
				{' '}
				Bạn chưa xác minh danh tính nên bạn chưa rút tiền được{' '}
			</span>
			<a
				href='#'
				className='ml-2 text-primary underline hover:underline font-semibold transition'>
				Xác minh danh tính
			</a>
		</div>
	);
};

export default VerifyAlert;
