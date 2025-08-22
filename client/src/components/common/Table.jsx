import React from 'react';
import PropTypes from 'prop-types';
import {
	Table as FlowbiteTable,
	TableBody,
	TableCell,
	TableHead,
	TableHeadCell,
	TableRow,
} from 'flowbite-react';

/**
 * Universal Table component using Flowbite React Table
 * Props:
 * - headers: [{ label, key, className? }]
 * - data: array of objects
 * - renderRow: (item, idx) => ReactNode (custom row rendering, optional)
 * - isCheckBox: boolean (show checkbox column)
 * - checkedItems: array of checked row keys/ids
 * - onCheckAll: () => void
 * - onCheckRow: (item) => void
 * - loading: boolean
 * - emptyText: string
 */
const Table = ({
	headers = [],
	data = [],
	renderRow,
	isCheckBox = false,
	checkedItems = [],
	onCheckAll,
	onCheckRow,
	loading = false,
	emptyText = 'No data',
	rowKey = 'id',
}) => {
	const allChecked = data.length > 0 && checkedItems.length === data.length;

	return (
		<div className='overflow-x-auto rounded-lg border border-gray-200 shadow-sm mt-5'>
			<FlowbiteTable hoverable key={data.length}>
				<TableHead>
					<TableRow>
						{isCheckBox && (
							<TableHeadCell className='w-10'>
								<input
									type='checkbox'
									checked={allChecked}
									onChange={onCheckAll}
									className='text-blue-600'
								/>
							</TableHeadCell>
						)}
						{headers.map((h, idx) => (
							<TableHeadCell
								key={h.key || idx}
								className={`${h.className} dark:!bg-gray-500 dark:!text-white`}>
								{h.label}
							</TableHeadCell>
						))}
					</TableRow>
				</TableHead>
				<TableBody className='divide-y'>
					{loading ? (
						<TableRow>
							<TableCell
								colSpan={headers.length + (isCheckBox ? 1 : 0)}
								className='text-center py-6'>
								Đang tải dữ liệu...
							</TableCell>
						</TableRow>
					) : data.length === 0 ? (
						<TableRow>
							<TableCell
								colSpan={headers.length + (isCheckBox ? 1 : 0)}
								className='text-center py-6'>
								{emptyText}
							</TableCell>
						</TableRow>
					) : renderRow ? (
						data.map((item, idx) => renderRow(item, idx))
					) : (
						data.map((item, idx) => (
							<TableRow key={item[rowKey] || idx}>
								{isCheckBox && (
									<TableCell>
										<input
											type='checkbox'
											checked={checkedItems.includes(
												item[rowKey],
											)}
											onChange={() => onCheckRow(item)}
											className='text-blue-600'
										/>
									</TableCell>
								)}
								{headers.map((h, hIdx) => (
									<TableCell key={h.key || hIdx}>
										{item[h.key]}
									</TableCell>
								))}
							</TableRow>
						))
					)}
				</TableBody>
			</FlowbiteTable>
		</div>
	);
};

Table.propTypes = {
	headers: PropTypes.arrayOf(
		PropTypes.shape({
			label: PropTypes.node.isRequired,
			key: PropTypes.string,
			className: PropTypes.string,
		}),
	).isRequired,
	data: PropTypes.array,
	renderRow: PropTypes.func,
	isCheckBox: PropTypes.bool,
	checkedItems: PropTypes.array,
	onCheckAll: PropTypes.func,
	onCheckRow: PropTypes.func,
	loading: PropTypes.bool,
	emptyText: PropTypes.string,
	rowKey: PropTypes.string,
};

export default Table;
