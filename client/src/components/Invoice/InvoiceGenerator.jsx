import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
	Printer, 
	Download, 
	Mail, 
	Eye, 
	FileText,
	Share2,
	RefreshCw
} from 'lucide-react';
import { invoiceAPI } from '../../services/invoice.service';

const InvoiceGenerator = () => {
	const { orderId } = useParams();
	const [loading, setLoading] = useState(false);
	const [invoiceData, setInvoiceData] = useState(null);
	const [previewHtml, setPreviewHtml] = useState('');
	const [showPreview, setShowPreview] = useState(false);

	useEffect(() => {
		if (orderId) {
			generateInvoice();
		}
	}, [orderId]);

	const generateInvoice = async () => {
		setLoading(true);
		try {
			const response = await invoiceAPI.generateInvoice(orderId);
			setInvoiceData(response.data);
			toast.success('Tạo hóa đơn thành công!');
		} catch (error) {
			toast.error('Có lỗi xảy ra khi tạo hóa đơn');
			console.error('Error generating invoice:', error);
		} finally {
			setLoading(false);
		}
	};

	const downloadInvoice = async () => {
		setLoading(true);
		try {
			const response = await invoiceAPI.downloadInvoice(orderId);
			// Tạo blob và download
			const blob = new Blob([response.data], { type: 'application/pdf' });
			const url = window.URL.createObjectURL(blob);
			const link = document.createElement('a');
			link.href = url;
			link.download = `invoice-${orderId}.pdf`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			window.URL.revokeObjectURL(url);
			toast.success('Tải hóa đơn thành công!');
		} catch (error) {
			toast.error('Có lỗi xảy ra khi tải hóa đơn');
			console.error('Error downloading invoice:', error);
		} finally {
			setLoading(false);
		}
	};

	const printInvoice = async () => {
		setLoading(true);
		try {
			const response = await invoiceAPI.printInvoice(orderId);
			const printWindow = window.open('', '_blank');
			printWindow.document.write(response.data.html);
			printWindow.document.close();
			printWindow.print();
			toast.success('Mở cửa sổ in!');
		} catch (error) {
			toast.error('Có lỗi xảy ra khi in hóa đơn');
			console.error('Error printing invoice:', error);
		} finally {
			setLoading(false);
		}
	};

	const sendInvoiceByEmail = async () => {
		const email = prompt('Nhập email để gửi hóa đơn:');
		if (!email) return;

		setLoading(true);
		try {
			await invoiceAPI.sendInvoiceByEmail(orderId, { email });
			toast.success('Gửi hóa đơn qua email thành công!');
		} catch (error) {
			toast.error('Có lỗi xảy ra khi gửi email');
			console.error('Error sending invoice:', error);
		} finally {
			setLoading(false);
		}
	};

	const previewInvoice = async () => {
		setLoading(true);
		try {
			const response = await invoiceAPI.getInvoicePreview(orderId);
			setPreviewHtml(response.data.html);
			setShowPreview(true);
		} catch (error) {
			toast.error('Có lỗi xảy ra khi xem preview');
			console.error('Error previewing invoice:', error);
		} finally {
			setLoading(false);
		}
	};

	const shareInvoice = () => {
		if (navigator.share) {
			navigator.share({
				title: 'Hóa đơn',
				text: 'Hóa đơn của bạn',
				url: window.location.href
			});
		} else {
			// Fallback: copy to clipboard
			navigator.clipboard.writeText(window.location.href);
			toast.success('Đã sao chép link vào clipboard!');
		}
	};

	return (
		<div className="max-w-4xl mx-auto p-6">
			<div className="bg-white rounded-lg shadow-lg p-6">
				{/* Header */}
				<div className="flex justify-between items-center mb-6">
					<div>
						<h1 className="text-2xl font-bold text-gray-800">Hóa đơn</h1>
						<p className="text-gray-600">Quản lý và tạo hóa đơn cho đơn hàng</p>
					</div>
					<div className="flex items-center space-x-2">
						<button
							onClick={generateInvoice}
							disabled={loading}
							className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
						>
							<RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
							Tạo mới
						</button>
					</div>
				</div>

				{/* Invoice Info */}
				{invoiceData && (
					<div className="bg-gray-50 rounded-lg p-4 mb-6">
						<div className="grid grid-cols-2 gap-4">
							<div>
								<p className="text-sm text-gray-600">Số hóa đơn</p>
								<p className="font-semibold">{invoiceData.invoiceNumber}</p>
							</div>
							<div>
								<p className="text-sm text-gray-600">Mã đơn hàng</p>
								<p className="font-semibold">{orderId}</p>
							</div>
						</div>
					</div>
				)}

				{/* Action Buttons */}
				<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
					<button
						onClick={previewInvoice}
						disabled={loading}
						className="flex flex-col items-center p-4 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 disabled:opacity-50"
					>
						<Eye className="w-6 h-6 mb-2" />
						<span className="text-sm">Xem trước</span>
					</button>

					<button
						onClick={downloadInvoice}
						disabled={loading}
						className="flex flex-col items-center p-4 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 disabled:opacity-50"
					>
						<Download className="w-6 h-6 mb-2" />
						<span className="text-sm">Tải PDF</span>
					</button>

					<button
						onClick={printInvoice}
						disabled={loading}
						className="flex flex-col items-center p-4 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 disabled:opacity-50"
					>
						<Printer className="w-6 h-6 mb-2" />
						<span className="text-sm">In hóa đơn</span>
					</button>

					<button
						onClick={sendInvoiceByEmail}
						disabled={loading}
						className="flex flex-col items-center p-4 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 disabled:opacity-50"
					>
						<Mail className="w-6 h-6 mb-2" />
						<span className="text-sm">Gửi email</span>
					</button>

					<button
						onClick={shareInvoice}
						disabled={loading}
						className="flex flex-col items-center p-4 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 disabled:opacity-50"
					>
						<Share2 className="w-6 h-6 mb-2" />
						<span className="text-sm">Chia sẻ</span>
					</button>

					<button
						onClick={() => window.open(`/api/v1/invoices/download/${orderId}`, '_blank')}
						disabled={loading}
						className="flex flex-col items-center p-4 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 disabled:opacity-50"
					>
						<FileText className="w-6 h-6 mb-2" />
						<span className="text-sm">Mở PDF</span>
					</button>
				</div>

				{/* Loading State */}
				{loading && (
					<div className="flex justify-center items-center py-8">
						<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
						<span className="ml-2 text-gray-600">Đang xử lý...</span>
					</div>
				)}

				{/* Preview Modal */}
				{showPreview && (
					<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
						<div className="bg-white rounded-lg w-11/12 h-5/6 overflow-hidden">
							<div className="flex justify-between items-center p-4 border-b">
								<h3 className="text-lg font-semibold">Xem trước hóa đơn</h3>
								<button
									onClick={() => setShowPreview(false)}
									className="text-gray-500 hover:text-gray-700"
								>
									✕
								</button>
							</div>
							<div className="p-4 h-full overflow-auto">
								<div dangerouslySetInnerHTML={{ __html: previewHtml }} />
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default InvoiceGenerator;
