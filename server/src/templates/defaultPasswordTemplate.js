const defaultPasswordTemplate = ({ name, password }) => {
	return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Xin chào ${name},</h2>
            <p>Cảm ơn bạn đã đăng nhập vào hệ thống của chúng tôi thông qua tài khoản mạng xã hội.</p>
            <p>Chúng tôi đã tạo một mật khẩu mặc định cho tài khoản của bạn:</p>
            <div style="background-color: #f5f5f5; padding: 15px; margin: 20px 0; border-radius: 5px;">
                <p style="font-family: monospace; font-size: 18px; margin: 0;"><strong>${password}</strong></p>
            </div>
            <p><strong>Lưu ý quan trọng:</strong></p>
            <ul>
                <li>Mật khẩu này sẽ hết hạn sau 48 giờ</li>
                <li>Vui lòng đổi mật khẩu ngay sau khi đăng nhập để đảm bảo an toàn cho tài khoản của bạn</li>
            </ul>
            <p>Nếu bạn không thực hiện đăng nhập này, vui lòng bỏ qua email này và liên hệ với chúng tôi ngay lập tức.</p>
            <p>Trân trọng,<br>Đội ngũ hỗ trợ</p>
        </div>
    `;
};

export default defaultPasswordTemplate;
