const changePasswordTemplate = ({ time }) => {
	// EN
	// return `
	// <div style="font-family: Arial, sans-serif; line-height: 1.6;">
	//     <h2>Hello ${name},</h2>
	//     <p>We received a request to reset your password. Use the OTP code below to reset your    password:</p>
	//     <div style="text-align:center;font-size:30px;font-weight:bold">
	//         ${otpCode}
	//     </div>
	//     </p>
	//     <p> This code is valid for 30 minutes. Please do not share this code with anyone.</p>
	//     <p>If you did not request a password reset, please ignore this email or contact support if you have questions.</p>
	//     <p>	Thanks you,</p>
	//     <p>	Team TKT-Shop</p>
	// </div>
	// `;

	// VN
	return `
    <div style="background-color: #f5f7fa; margin:0; padding: 40px;  font-size:16px;">
        <div style="max-width: 550px; margin: 0 auto; background: #fff; border-radius: 8px; box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); padding: 30px; text-align: center;">
            <h2 style="color: #333;">Mật khẩu của bạn đã được thay đổi</h2>
            <p style="color: #555; text-align:left;">Mật khẩu tài khoản của bạn đã được thay đổi vào lúc ${time}.</p>
            <p style="color: #555; text-align:left;">Nếu bạn không làm điều điều này, hãy liên hệ cho chúng tôi qua email <a href="mailto:tampham436@gmail.com" style="color: #007bff; text-decoration: none;">tampham436@gmail.com</a> để được hỗ trợ.
            </p>
            <p style="color: #555; text-align:left;">Trân trọng,</p>
            <p style="color: #555; text-align:left;"><strong>Đội ngũ phát triển E-Technology</strong></p>
        </div>
    </div>
	`;
};

export default changePasswordTemplate;
