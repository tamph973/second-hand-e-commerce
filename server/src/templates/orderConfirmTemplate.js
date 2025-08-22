const orderConfirmTemplate = ({
	customerName,
	orderId,
	orderDate,
	shippingAddress,
	products,
	subtotal,
	shippingFee,
	discount,
	totalAmount,
	paymentStatus,
	paymentMethod,
}) => {
	const formatCurrency = (amount) => {
		return new Intl.NumberFormat('vi-VN', {
			style: 'currency',
			currency: 'VND',
		}).format(amount);
	};

	const formatDate = (date) => {
		return new Date(date).toLocaleDateString('vi-VN', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		});
	};

	return `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Xác nhận đặt hàng - 2ECOC</title>
        <style>
            /* Reset default styles */
            body, div, h1, h2, h3, h4, p, a, span { margin: 0; padding: 0; }
            body { font-family: Arial, Helvetica, sans-serif; background-color: #f5f7fa; color: #333; }
            a { color: #007bff; text-decoration: none; }
            img { border: none; -ms-interpolation-mode: bicubic; max-width: 100%; }

            /* Container */
            .container { max-width: 600px; margin: 0 auto; background-color: #fff; border: 1px solid #ddd; }

            /* Header */
            .header { background: linear-gradient(135deg, #667eea, #764ba2); padding: 20px; text-align: center; }
            .header a img { width: 150px; height: auto; display: block; margin: 0 auto; }

            /* Content Sections */
            .content { padding: 20px; }
            .content h2 { color: #2c3e50; font-size: 20px; text-align: center; margin-bottom: 15px; }
            .content p { color: #555; line-height: 1.5; font-size: 14px; margin-bottom: 15px; }
            .content strong { color: #2c3e50; }

            /* Shipping Info */
            .shipping-info { background: #f8f9fa; padding: 15px; border-left: 4px solid #667eea; margin-bottom: 15px; }
            .shipping-info p { margin: 5px 0; font-size: 14px; }

            /* Order Details */
            .order-details h3 { color: #2c3e50; font-size: 16px; border-bottom: 1px solid #ecf0f1; padding-bottom: 10px; margin-bottom: 15px; }
            .order-meta { display: flex; justify-content: space-between; font-size: 12px; color: #7f8c8d; margin-bottom: 15px; }
            .product-item { display: flex; background: #f8f9fa; padding: 15px; margin-bottom: 15px; border: 1px solid #e9ecef; }
            .product-image { width: 80px; height: 80px; margin-right: 15px; }
            .product-image img { width: 100%; height: 100%; object-fit: cover; border-radius: 4px; }
            .product-details { flex: 1; }
            .product-details h4 { font-size: 14px; margin-bottom: 5px; }
            .product-details p { font-size: 12px; margin: 2px 0; color: #7f8c8d; }
            .product-details .price { color: #e74c3c; font-weight: bold; font-size: 14px; }

            /* Footer */
            .footer { background: #2c3e50; padding: 20px; text-align: center; color: #fff; }
            .footer a img { width: 150px; height: auto; margin: 0 auto 10px; }
            .footer p { font-size: 11px; opacity: 0.6; margin: 5px 0; }
            .social-links { margin: 15px 0; }
            .social-links a { display: inline-block; width: 30px; height: 30px; line-height: 30px; background: #fff; color: #2c3e50; border-radius: 50%; margin: 0 5px; text-align: center; }

            /* Responsive Design */
            @media only screen and (max-width: 600px) {
                .container { width: 100% !important; }
                .product-item { flex-direction: column; }
                .product-image { width: 100%; margin-bottom: 10px; }
                .product-details { width: 100%; }
                .header a img { width: 120px; }
                .footer a img { width: 120px; }
                
                /* Responsive cho layout mới */
                .content > div[style*="display: flex"] { 
                    flex-direction: column !important; 
                }
                .content > div[style*="display: flex"] > div[style*="width: 40%"] { 
                    width: 100% !important; 
                    margin-top: 20px;
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <!-- Header với Logo -->
            <div class="header">
                <a href="http://localhost:5173/"><img src="https://res.cloudinary.com/tamph973/image/upload/v1755418202/e-technology/logo_qrygb7.png" alt="2ECOC Logo"></a>
            </div>

            <!-- Lời cảm ơn và thông báo -->
            <div class="content">
                <h2>Cảm ơn bạn đã đặt hàng tại 2ECOC!</h2>
                <p>Xin chào <strong>${customerName}</strong>,</p>
                <p>2ECOC đã tiếp nhận đơn hàng của bạn và thông báo cho người bán. Chúng tôi sẽ gửi thông báo cho bạn khi đơn hàng đã sẵn sàng được chuyển đi.</p>
            </div>

            <!-- Thông tin giao hàng -->
            <div class="content">
                <h3>📦 Thông tin giao hàng</h3>
                <div class="shipping-info">
                    <p><strong>Họ tên:</strong> ${shippingAddress.fullName}</p>
                    <p><strong>Địa chỉ:</strong> ${
						shippingAddress.address +
						', ' +
						shippingAddress.wardName +
						', ' +
						shippingAddress.districtName +
						', ' +
						shippingAddress.provinceName
					}</p>
                    <p><strong>Số điện thoại:</strong> ${
						shippingAddress.phone
					}</p>
                </div>
            </div>



            <!-- Chi tiết sản phẩm -->
            <div class="content">
                <h3 style="color: #2c3e50; font-size: 18px; margin-bottom: 15px;">Chi tiết sản phẩm</h3>
                ${products
					.map(
						(product) => `
                <div style="background: #f8f9fa; padding: 15px; margin-bottom: 15px; border-radius: 8px; border-left: 4px solid #667eea;">
                    <div style="display: flex; align-items: center;">
                        <img src="${
							product.image ||
							'https://via.placeholder.com/60x60?text=Product'
						}" alt="${
							product.name
						}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 6px; margin-right: 15px;">
                        <div style="flex: 1;">
                            <h4 style="margin: 0 0 5px 0; font-size: 14px; color: #2c3e50;">${
								product.name
							}</h4>
                            <p style="margin: 2px 0; font-size: 12px; color: #7f8c8d;"><strong>Tình trạng:</strong> ${
								product.condition
							}</p>
                            <p style="margin: 2px 0; font-size: 12px; color: #7f8c8d;"><strong>Số lượng:</strong> ${
								product.quantity
							}</p>
                            <p style="margin: 5px 0 0 0; font-size: 14px; color: #e74c3c; font-weight: bold;">${formatCurrency(
								product.price,
							)}</p>
                        </div>
                    </div>
                </div>
                `,
					)
					.join('')}
            </div>

            <!-- Thông tin giá tiền và thanh toán -->
            <div class="content">
                <div style="padding: 25px; margin-bottom: 25px; background: #f8f9fa; border-radius: 10px;">
                    <h3 style="margin: 0 0 25px 0; font-size: 22px; text-align: center; color: #2c3e50; font-weight: 600;">Thông tin đơn hàng</h3>
                    
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; font-size: 15px; line-height: 1.4;">
                        <span style="color: #555; font-weight: 500; margin-right: 8px;">Tổng đơn hàng:</span>
                        <span style="font-weight: 600; color: #2c3e50;">${formatCurrency(
							subtotal,
						)}</span>
                    </div>
                    
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; font-size: 15px; line-height: 1.4;">
                        <span style="color: #555; font-weight: 500; margin-right: 8px;">Phí vận chuyển:</span>
                        <span style="font-weight: 600; color: #2c3e50;">${formatCurrency(
							shippingFee,
						)}</span>
                    </div>
                    
                    
                    ${
						discount > 0
							? `
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; font-size: 15px; line-height: 1.4;">
                        <span style="color: #555; font-weight: 500; margin-right: 8px;">Giảm giá:</span>
                        <span style="font-weight: 600; color: #e74c3c;">-${formatCurrency(
							discount,
						)}</span>
                    </div>
                    `
							: ''
					}
                    
                    <hr style="border: none; border-top: 2px solid #ddd; margin: 25px 0;">
                    
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; font-size: 17px; line-height: 1.4;">
                        <span style="font-weight: 700; color: #2c3e50; margin-right: 8px;">Tổng thanh toán:</span>
                        <span style="font-weight: 700; color: #e74c3c; font-size: 18px;">${formatCurrency(
							totalAmount,
						)}</span>
                    </div>
                    
                    <div style="display: flex; justify-content: space-between; align-items: center; font-size: 15px; line-height: 1.4;">
                        <span style="color: #555; margin-right: 8px; font-weight: 500;">Trạng thái:</span>
                        <span style="font-weight: 600; color: #27ae60;">${
							paymentStatus === 'PAID'
								? 'Đã thanh toán'
								: 'Chưa thanh toán'
						}</span>
                    </div>
                </div>
                
                <!-- Thông tin đơn hàng -->
                <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; border-left: 5px solid #667eea;">
                    <h4 style="margin: 0 0 15px 0; font-size: 18px; color: #2c3e50; font-weight: 600;">Thông tin đơn hàng</h4>
                    <p style="margin: 8px 0; font-size: 14px; color: #7f8c8d; line-height: 1.5;"><strong style="color: #555;">Mã đơn hàng:</strong> <a href="http://localhost:5173/user/purchases/${orderId}" style="color: #667eea; text-decoration: none; font-weight: 500;">#${orderId}</a></p>
                    <p style="margin: 8px 0; font-size: 14px; color: #7f8c8d; line-height: 1.5;"><strong style="color: #555;">Ngày đặt:</strong> ${formatDate(
						orderDate,
					)}</p>
                    <p style="margin: 8px 0; font-size: 14px; color: #7f8c8d; line-height: 1.5;"><strong style="color: #555;">Hình thức:</strong> ${paymentMethod}</p>
                </div>
            </div>

            <!-- Lời cảm ơn và hỗ trợ -->
            <div class="content">
                <div style="background: linear-gradient(135deg, #667eea, #764ba2); padding: 20px; text-align: center; border-radius: 5px;">
                    <h3 style="color: #fff; margin-bottom: 10px;">Cần hỗ trợ?</h3>
                    <p style="color: #fff; opacity: 0.9; margin-bottom: 10px;">Bạn có thể tham khảo mục <a href="#" style="color: #fff; text-decoration: underline;">Hỏi Đáp</a> tại website 2ECOC hoặc phản hồi cho chúng tôi qua thư này nếu có bất kỳ thắc mắc nào, chúng tôi luôn sẵn sàng hỗ trợ bạn.</p>
                    <p style="color: #fff;">Trân trọng,</p>
                    <p style="color: #fff; font-weight: bold;">2ECOC Việt Nam</p>
                    <p style="color: #fff; opacity: 0.8;">(Vì một trái đất xanh sạch hơn)</p>
                    <div style="margin-top: 15px;">
                        <a href="http://localhost:5173/user/purchases/${orderId}" style="display: inline-block; background: #fff; color: #667eea; padding: 10px 20px; border-radius: 20px; text-decoration: none; font-weight: bold;">Xem đơn hàng</a>
                    </div>
                </div>
            </div>

            <!-- Footer với logo và social links -->
            <div class="footer">
                <a href="http://localhost:5173/"><img src="https://res.cloudinary.com/tamph973/image/upload/v1755418202/e-technology/logo_qrygb7.png" alt="2ECOC Logo"></a>
                <p>© ${new Date().getFullYear()} 2ECOC Việt Nam. Mọi quyền được bảo lưu.</p>
                <p>Bạn nhận được email này vì đã đăng ký trên trang web của chúng tôi.</p>
                
                <div class="social-links">
                    <a href="https://facebook.com/TuiTenTam973" title="Facebook"><img src="https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png" alt="Facebook" style="width: 30px; height: 30px;" /></a>
                    <a href="https://linkedin.com/in/tamph973" title="LinkedIn"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/LinkedIn_icon_circle.svg/2048px-LinkedIn_icon_circle.svg.png" alt="LinkedIn" style="width: 30px; height: 30px;" /></a>
                    <a href="https://github.com/tamph973" title="GitHub"><img src="https://cdn-icons-png.flaticon.com/128/2111/2111432.png" alt="GitHub" style="width: 30px; height: 30px;" /></a>
                </div>
            </div>
        </div>
    </body>
    </html>
    `;
};

export default orderConfirmTemplate;
