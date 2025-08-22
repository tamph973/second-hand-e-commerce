import PropTypes from 'prop-types';

const ProgressIndicator = ({
	steps = [],
	currentStep = 0,
	orientation = 'horizontal',
	showStepNumbers = true,
	showStepIcons = true,
	showStepLabels = true,
	showProgressBar = true,
	size = 'medium',
	variant = 'default',
	className = '',
	onStepClick,
	...props
}) => {
	const getStepStatus = (index) => {
		if (index < currentStep) return 'completed';
		if (index === currentStep) return 'active';
		return 'pending';
	};

	const getStepIcon = (step, status) => {
		if (step.icon) return step.icon;

		switch (status) {
			case 'completed':
				return (
					<svg
						className='w-4 h-4'
						viewBox='0 0 24 24'
						fill='none'
						xmlns='http://www.w3.org/2000/svg'>
						<path
							d='M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z'
							fill='currentColor'
						/>
					</svg>
				);
			case 'active':
				return (
					<svg
						className='w-4 h-4'
						viewBox='0 0 24 24'
						fill='none'
						xmlns='http://www.w3.org/2000/svg'>
						<circle
							cx='12'
							cy='12'
							r='8'
							stroke='currentColor'
							strokeWidth='2'
							fill='none'
						/>
					</svg>
				);
			default:
				return (
					<svg
						className='w-4 h-4'
						viewBox='0 0 24 24'
						fill='none'
						xmlns='http://www.w3.org/2000/svg'>
						<circle
							cx='12'
							cy='12'
							r='8'
							stroke='currentColor'
							strokeWidth='2'
							fill='none'
						/>
					</svg>
				);
		}
	};

	const getSizeClasses = () => {
		switch (size) {
			case 'small':
				return {
					stepIcon: 'w-8 h-8 text-sm',
					stepLabel: 'text-xs',
					stepDescription: 'text-xs',
					iconSize: 'w-3 h-3',
				};
			case 'large':
				return {
					stepIcon: 'w-16 h-16 text-lg',
					stepLabel: 'text-base',
					stepDescription: 'text-sm',
					iconSize: 'w-6 h-6',
				};
			default:
				return {
					stepIcon: 'w-12 h-12 text-sm',
					stepLabel: 'text-sm',
					stepDescription: 'text-xs',
					iconSize: 'w-4 h-4',
				};
		}
	};

	const getVariantClasses = () => {
		switch (variant) {
			case 'primary':
				return {
					active: 'bg-blue-500 border-blue-500 text-white shadow-lg',
					completed: 'bg-green-500 border-green-500 text-white',
					pending: 'bg-gray-100 border-gray-300 text-gray-400',
					progressBar: 'bg-blue-500',
					connector: 'bg-green-500',
				};
			case 'success':
				return {
					active: 'bg-green-500 border-green-500 text-white shadow-lg',
					completed: 'bg-green-500 border-green-500 text-white',
					pending: 'bg-gray-100 border-gray-300 text-gray-400',
					progressBar: 'bg-green-500',
					connector: 'bg-green-500',
				};
			case 'warning':
				return {
					active: 'bg-yellow-500 border-yellow-500 text-white shadow-lg',
					completed: 'bg-green-500 border-green-500 text-white',
					pending: 'bg-gray-100 border-gray-300 text-gray-400',
					progressBar: 'bg-yellow-500',
					connector: 'bg-green-500',
				};
			case 'error':
				return {
					active: 'bg-red-500 border-red-500 text-white shadow-lg',
					completed: 'bg-green-500 border-green-500 text-white',
					pending: 'bg-gray-100 border-gray-300 text-gray-400',
					progressBar: 'bg-red-500',
					connector: 'bg-green-500',
				};
			default:
				return {
					active: 'bg-blue-500 border-blue-500 text-white shadow-lg',
					completed: 'bg-green-500 border-green-500 text-white',
					pending: 'bg-gray-100 border-gray-300 text-gray-400',
					progressBar: 'bg-blue-500',
					connector: 'bg-green-500',
				};
		}
	};

	const handleStepClick = (index) => {
		if (onStepClick && typeof onStepClick === 'function') {
			onStepClick(index);
		}
	};

	const sizeClasses = getSizeClasses();
	const variantClasses = getVariantClasses();

	const containerClass = `w-full relative ${
		orientation === 'vertical' ? 'flex' : 'flex-col'
	} ${className}`.trim();

	return (
		<div className={containerClass} {...props}>
			{/* Progress Bar for Horizontal */}
			{showProgressBar && orientation === 'horizontal' && (
				<div className='absolute top-6 left-0 w-full h-0.5 bg-gray-200 z-10'>
					<div
						className={`h-full transition-all duration-300 ease-in-out ${variantClasses.progressBar}`}
						style={{
							width: `${
								(currentStep / (steps.length - 1)) * 100
							}%`,
						}}
					/>
				</div>
			)}

			{/* Steps Container */}
			<div
				className={`relative z-20 ${
					orientation === 'horizontal'
						? 'flex items-start justify-between'
						: 'flex flex-col'
				}`}>
				{steps.map((step, index) => {
					const status = getStepStatus(index);
					const isClickable = onStepClick && index <= currentStep;

					const stepIconClass = `flex items-center justify-center rounded-full border-2 font-semibold transition-all duration-300 flex-shrink-0 ${
						sizeClasses.stepIcon
					} ${
						status === 'active'
							? variantClasses.active
							: status === 'completed'
							? variantClasses.completed
							: variantClasses.pending
					} ${isClickable ? 'cursor-pointer hover:scale-105' : ''}`;

					return (
						<div
							key={index}
							className={`${
								orientation === 'horizontal'
									? 'flex flex-col items-center flex-1 relative'
									: 'flex items-start mb-4 relative'
							}`}
							onClick={() =>
								isClickable && handleStepClick(index)
							}>
							{/* Step Content */}
							<div
								className={`${
									orientation === 'horizontal'
										? 'flex flex-col items-center text-center p-2 min-w-0'
										: 'flex items-center p-2 min-w-0'
								}`}>
								{/* Step Icon/Number */}
								{showStepIcons && (
									<div className={stepIconClass}>
										<div className={sizeClasses.iconSize}>
											{getStepIcon(step, status)}
										</div>
									</div>
								)}

								{showStepNumbers && !showStepIcons && (
									<div className={stepIconClass}>
										{index + 1}
									</div>
								)}

								{/* Step Label */}
								{showStepLabels && step.label && (
									<div
										className={`font-semibold mt-2 transition-colors duration-300 ${
											sizeClasses.stepLabel
										} ${
											status === 'active'
												? 'text-gray-900'
												: status === 'completed'
												? 'text-green-600'
												: 'text-gray-500'
										}`}>
										{step.label}
									</div>
								)}

								{/* Step Description */}
								{step.description && (
									<div
										className={`mt-1 text-center overflow-hidden text-ellipsis whitespace-nowrap ${sizeClasses.stepDescription} text-gray-500`}>
										{step.description}
									</div>
								)}
							</div>

							{/* Step Connector */}
							{index < steps.length - 1 && (
								<div
									className={`absolute ${
										orientation === 'horizontal'
											? 'top-6 left-1/2 w-full h-0.5 bg-gray-200 -z-10'
											: 'left-6 top-12 w-0.5 h-full bg-gray-200 -z-10'
									} ${
										status === 'completed'
											? variantClasses.connector
											: ''
									}`}
								/>
							)}
						</div>
					);
				})}
			</div>
		</div>
	);
};

ProgressIndicator.propTypes = {
	steps: PropTypes.arrayOf(
		PropTypes.shape({
			label: PropTypes.string,
			description: PropTypes.string,
			icon: PropTypes.node,
		}),
	).isRequired,
	currentStep: PropTypes.number,
	orientation: PropTypes.oneOf(['horizontal', 'vertical']),
	showStepNumbers: PropTypes.bool,
	showStepIcons: PropTypes.bool,
	showStepLabels: PropTypes.bool,
	showProgressBar: PropTypes.bool,
	size: PropTypes.oneOf(['small', 'medium', 'large']),
	variant: PropTypes.oneOf([
		'default',
		'primary',
		'success',
		'warning',
		'error',
	]),
	className: PropTypes.string,
	onStepClick: PropTypes.func,
};

export default ProgressIndicator;
