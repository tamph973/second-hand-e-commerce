import { formatDate, formatPriceVND } from '@/utils/helpers';

/* eslint-disable react/prop-types */
const TransactionTable = ({ data }) => {
	const history = data?.transactions.map((tx) => tx.paymentHistory).flat();

	return (
		<div>
			{data?.transactions.length === 0 ? (
				<div className='text-textSecondary text-center py-10 text-lg'>
					0 Giao dịch
				</div>
			) : (
				<div className='overflow-x-auto'>
					<table className='min-w-full text-sm rounded-2xl overflow-hidden'>
						<thead>
							<tr className='bg-gray-100 text-textPrimary'>
								<th className='py-3 px-4 text-left'>Ngày</th>
								<th className='py-3 px-4 text-left'>
									Mã giao dịch
								</th>
								<th className='py-3 px-4 text-left'>
									Chi tiết
								</th>
								<th className='py-3 px-4 text-right'>
									Giá trị
								</th>
							</tr>
						</thead>
						<tbody>
							{history
								?.filter(
									(tx) =>
										tx.paymentMethod === 'ESCROW_RELEASE',
								)
								?.map((tx, idx) => (
									<tr
										key={idx}
										className='border-b border-gray-100 last:border-0 hover:bg-gray-50 transition text-textPrimary'>
										<td className='py-3 px-4'>
											{formatDate(tx.date)}
										</td>
										<td className='py-3 px-4'>
											{tx.transactionId}
										</td>
										<td className='py-3 px-4'>{tx.note}</td>
										<td className='py-3 px-4 text-right'>
											{formatPriceVND(tx.amount)}
										</td>
									</tr>
								))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
};

export default TransactionTable;
