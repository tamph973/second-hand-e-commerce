import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const ImageModerationSettings = () => {
	const [settings, setSettings] = useState({
		enabled: true,
		strictMode: false,
		autoReject: true,
		notifyAdmin: true,
		confidenceThreshold: 70,
	});

	const [stats, setStats] = useState({
		totalChecked: 0,
		appropriateCount: 0,
		inappropriateCount: 0,
		averageConfidence: 0,
	});

	const [loading, setLoading] = useState(false);
	const [statsLoading, setStatsLoading] = useState(false);

	useEffect(() => {
		loadSettings();
		loadStats();
	}, []);

	const loadSettings = async () => {
		try {
			const response = await axios.get(
				'/api/v1/image-moderation/settings',
			);
			setSettings(response.data.settings);
		} catch (error) {
			console.error('Error loading settings:', error);
		}
	};

	const loadStats = async () => {
		setStatsLoading(true);
		try {
			const response = await axios.get('/api/v1/image-moderation/stats');
			setStats(response.data.stats);
		} catch (error) {
			console.error('Error loading stats:', error);
		} finally {
			setStatsLoading(false);
		}
	};

	const saveSettings = async () => {
		setLoading(true);
		try {
			await axios.put('/api/v1/image-moderation/settings', settings);
			toast.success('Cài đặt đã được lưu thành công!');
		} catch (error) {
			toast.error('Lỗi khi lưu cài đặt');
			console.error('Error saving settings:', error);
		} finally {
			setLoading(false);
		}
	};

	const handleSettingChange = (key, value) => {
		setSettings((prev) => ({
			...prev,
			[key]: value,
		}));
	};

	const getConfidenceColor = (confidence) => {
		if (confidence >= 80) return 'text-green-600';
		if (confidence >= 60) return 'text-yellow-600';
		return 'text-red-600';
	};

	return (
		<div className='space-y-6'>
			<div className='bg-white rounded-lg shadow p-6'>
				<h2 className='text-xl font-semibold mb-4'>
					Cài đặt Kiểm duyệt Hình ảnh
				</h2>

				<div className='space-y-4'>
					{/* Bật/tắt kiểm duyệt */}
					<div className='flex items-center justify-between'>
						<div>
							<label className='text-sm font-medium text-gray-700'>
								Bật kiểm duyệt tự động
							</label>
							<p className='text-xs text-gray-500'>
								Tự động kiểm tra nội dung không phù hợp trong
								hình ảnh
							</p>
						</div>
						<label className='relative inline-flex items-center cursor-pointer'>
							<input
								type='checkbox'
								checked={settings.enabled}
								onChange={(e) =>
									handleSettingChange(
										'enabled',
										e.target.checked,
									)
								}
								className='sr-only peer'
							/>
							<div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
						</label>
					</div>

					{/* Chế độ nghiêm ngặt */}
					<div className='flex items-center justify-between'>
						<div>
							<label className='text-sm font-medium text-gray-700'>
								Chế độ nghiêm ngặt
							</label>
							<p className='text-xs text-gray-500'>
								Từ chối cả những hình ảnh có khả năng thấp chứa
								nội dung không phù hợp
							</p>
						</div>
						<label className='relative inline-flex items-center cursor-pointer'>
							<input
								type='checkbox'
								checked={settings.strictMode}
								onChange={(e) =>
									handleSettingChange(
										'strictMode',
										e.target.checked,
									)
								}
								className='sr-only peer'
								disabled={!settings.enabled}
							/>
							<div
								className={`w-11 h-6 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 ${
									settings.enabled
										? 'bg-gray-200 peer-focus:ring-4 peer-focus:ring-blue-300'
										: 'bg-gray-100'
								}`}></div>
						</label>
					</div>

					{/* Tự động từ chối */}
					<div className='flex items-center justify-between'>
						<div>
							<label className='text-sm font-medium text-gray-700'>
								Tự động từ chối
							</label>
							<p className='text-xs text-gray-500'>
								Tự động từ chối hình ảnh không phù hợp thay vì
								chờ admin duyệt
							</p>
						</div>
						<label className='relative inline-flex items-center cursor-pointer'>
							<input
								type='checkbox'
								checked={settings.autoReject}
								onChange={(e) =>
									handleSettingChange(
										'autoReject',
										e.target.checked,
									)
								}
								className='sr-only peer'
								disabled={!settings.enabled}
							/>
							<div
								className={`w-11 h-6 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 ${
									settings.enabled
										? 'bg-gray-200 peer-focus:ring-4 peer-focus:ring-blue-300'
										: 'bg-gray-100'
								}`}></div>
						</label>
					</div>

					{/* Ngưỡng độ tin cậy */}
					<div>
						<label className='text-sm font-medium text-gray-700'>
							Ngưỡng độ tin cậy: {settings.confidenceThreshold}%
						</label>
						<p className='text-xs text-gray-500 mb-2'>
							Hình ảnh có độ tin cậy thấp hơn sẽ bị từ chối
						</p>
						<input
							type='range'
							min='50'
							max='95'
							value={settings.confidenceThreshold}
							onChange={(e) =>
								handleSettingChange(
									'confidenceThreshold',
									parseInt(e.target.value),
								)
							}
							disabled={!settings.enabled}
							className='w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer disabled:opacity-50'
						/>
						<div className='flex justify-between text-xs text-gray-500 mt-1'>
							<span>50%</span>
							<span>95%</span>
						</div>
					</div>

					{/* Thông báo admin */}
					<div className='flex items-center justify-between'>
						<div>
							<label className='text-sm font-medium text-gray-700'>
								Thông báo cho admin
							</label>
							<p className='text-xs text-gray-500'>
								Gửi email thông báo khi có hình ảnh bị từ chối
							</p>
						</div>
						<label className='relative inline-flex items-center cursor-pointer'>
							<input
								type='checkbox'
								checked={settings.notifyAdmin}
								onChange={(e) =>
									handleSettingChange(
										'notifyAdmin',
										e.target.checked,
									)
								}
								className='sr-only peer'
								disabled={!settings.enabled}
							/>
							<div
								className={`w-11 h-6 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 ${
									settings.enabled
										? 'bg-gray-200 peer-focus:ring-4 peer-focus:ring-blue-300'
										: 'bg-gray-100'
								}`}></div>
						</label>
					</div>
				</div>

				<div className='mt-6'>
					<button
						onClick={saveSettings}
						disabled={loading}
						className='bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed'>
						{loading ? 'Đang lưu...' : 'Lưu cài đặt'}
					</button>
				</div>
			</div>

			{/* Thống kê */}
			<div className='bg-white rounded-lg shadow p-6'>
				<div className='flex items-center justify-between mb-4'>
					<h2 className='text-xl font-semibold'>
						Thống kê Kiểm duyệt
					</h2>
					<button
						onClick={loadStats}
						disabled={statsLoading}
						className='text-blue-600 hover:text-blue-700 text-sm'>
						{statsLoading ? 'Đang tải...' : 'Làm mới'}
					</button>
				</div>

				<div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
					<div className='bg-blue-50 p-4 rounded-lg'>
						<div className='text-2xl font-bold text-blue-600'>
							{stats.totalChecked}
						</div>
						<div className='text-sm text-blue-700'>
							Tổng số ảnh đã kiểm
						</div>
					</div>

					<div className='bg-green-50 p-4 rounded-lg'>
						<div className='text-2xl font-bold text-green-600'>
							{stats.appropriateCount}
						</div>
						<div className='text-sm text-green-700'>
							Ảnh phù hợp
						</div>
					</div>

					<div className='bg-red-50 p-4 rounded-lg'>
						<div className='text-2xl font-bold text-red-600'>
							{stats.inappropriateCount}
						</div>
						<div className='text-sm text-red-700'>
							Ảnh không phù hợp
						</div>
					</div>

					<div className='bg-yellow-50 p-4 rounded-lg'>
						<div
							className={`text-2xl font-bold ${getConfidenceColor(
								stats.averageConfidence,
							)}`}>
							{stats.averageConfidence}%
						</div>
						<div className='text-sm text-yellow-700'>
							Độ tin cậy trung bình
						</div>
					</div>
				</div>

				{stats.totalChecked > 0 && (
					<div className='mt-4'>
						<div className='flex justify-between text-sm text-gray-600 mb-1'>
							<span>Tỷ lệ ảnh phù hợp</span>
							<span>
								{Math.round(
									(stats.appropriateCount /
										stats.totalChecked) *
										100,
								)}
								%
							</span>
						</div>
						<div className='w-full bg-gray-200 rounded-full h-2'>
							<div
								className='bg-green-600 h-2 rounded-full'
								style={{
									width: `${
										(stats.appropriateCount /
											stats.totalChecked) *
										100
									}%`,
								}}></div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default ImageModerationSettings;
