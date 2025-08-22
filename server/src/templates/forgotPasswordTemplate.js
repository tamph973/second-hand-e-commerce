const forgotPasswordTemplate = ({ name, otpCode }) => {
    // EN
    // return `
    // <div style="background-color: #f5f7fa; margin: 0; padding: 40px; font-family: Arial, sans-serif; font-size: 16px;">
    //     <div style="max-width: 550px; margin: 0 auto; background: #fff; border-radius: 10px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); padding: 30px; text-align: center;">

    //         <h2 style="color: #2c3e50;">Hello ${name},</h2>
    //         <h3 style="color: #2c3e50;">Password Reset Request</h3>


    //         <p style="color: #555; text-align: left;">
    //             You are receiving this email because we received a password reset request for your account.
    //         </p>

    //         <div style="background: #f1f5f9; padding: 15px 25px; border-radius: 8px; font-size: 28px; font-weight: bold; display: inline-block; margin: 15px auto; letter-spacing: 6px; color: #1e40af;">
    //             ${otpCode}
    //         </div>

    //         <p style="color: #333; text-align: left;">
    //             <em><strong>Do not share this code with anyone</strong></em>, we will never contact you to ask for this code.
    //         </p>

    //         <p style="color: #555; text-align: left;">
    //         If you have any questions, please contact us at
    //         <a href="mailto:tampham436@gmail.com" style="color: #007bff; text-decoration: none;">tampham436@gmail.com</a> to get support.
    //         </p>

    //         <p style="color: #555; text-align: left;">Best regards,</p>
    //         <p style="color: #555; text-align: left;"><strong>E-Technology Development Team</strong></p>
    //     </div>
    // </div>
    // `;
    // VN

    return `
   <div style="background-color: #f5f7fa; margin: 0; padding: 40px; font-family: Arial, sans-serif; font-size: 16px;">
  <div style="max-width: 550px; margin: 0 auto; background: #fff; border-radius: 10px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); padding: 30px; text-align: center;">

    <h2 style="color: #2c3e50;">Xin chào ${name},</h2>
    <h3 style="color: #2c3e50;">Yêu cầu đặt lại mật khẩu</h3>
    
    <p style="color: #555; text-align: left;">
      Bạn nhận được email này vì chúng tôi đã nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.
    </p>

    <div style="background: #f1f5f9; padding: 15px 25px; border-radius: 8px; font-size: 28px; font-weight: bold; display: inline-block; margin: 15px auto; letter-spacing: 6px; color: #1e40af;">
      ${otpCode}
    </div>

    <p style="color: #333; text-align: left;">
      <em><strong>Đừng gửi mã này cho bất cứ ai</strong></em>, chúng tôi sẽ không bao giờ liên hệ cho bạn để lấy mã này.
    </p>

    <p style="color: #555; text-align: left;">
      Nếu có bất cứ thắc mắc nào, hãy liên hệ cho chúng tôi qua email 
      <a href="mailto:tampham436@gmail.com" style="color: #007bff; text-decoration: none;">tampham436@gmail.com</a> để được hỗ trợ.
    </p>

    <p style="color: #555; text-align: left;">Trân trọng,</p>
    <p style="color: #555; text-align: left;"><strong>Đội ngũ phát triển E-Technology</strong></p>
  </div>
</div>
	`;
};

export default forgotPasswordTemplate;
