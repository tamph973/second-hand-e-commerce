import { Tooltip } from 'flowbite-react';
import PropTypes from 'prop-types';
import { FaQuestionCircle } from 'react-icons/fa';

const ConditionSelector = ({
	value,
	onChange,
	error,
	options = [],
	className = '',
}) => {
	return (
		<div className={className}>
			<label className='flex items-center gap-2 text-sm font-medium text-gray-700 mb-2'>
				<div>
					Tình trạng<span className='text-red-500'>*</span>
				</div>
			</label>
			<div className='flex gap-3'>
				{options.map((opt) => (
					<Tooltip content={opt.title} key={opt.value}>
						<button
							key={opt.value}
							type='button'
							aria-pressed={value === opt.value}
							className={`px-5 py-2 rounded-full border transition focus:outline-none
              ${
					value === opt.value
						? 'bg-orange-50 border-primary text-primary font-semibold shadow'
						: 'bg-gray-50 border-gray-200 text-gray-700 hover:border-primary hover:bg-orange-50'
				}
            `}
							onClick={() => onChange(opt.value)}
							tabIndex={0}>
							{opt.label}
						</button>
					</Tooltip>
				))}
			</div>
			{error && <div className='text-xs text-red-500 mt-1'>{error}</div>}
		</div>
	);
};

ConditionSelector.propTypes = {
	value: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
	error: PropTypes.string,
	options: PropTypes.arrayOf(
		PropTypes.shape({
			value: PropTypes.string,
			label: PropTypes.string,
		}),
	),
	className: PropTypes.string,
};

export default ConditionSelector;
