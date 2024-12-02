
import nodemailer, { SentMessageInfo } from "nodemailer";

// Định nghĩa kiểu cho hàm sendMail
export const sendMail = async (email: string, subject: string, html: string): Promise<SentMessageInfo> => {
  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER as string, // Giả sử bạn đã khai báo EMAIL_USER trong .env
        pass: process.env.EMAIL_PASS as string, // Giả sử bạn đã khai báo EMAIL_PASS trong .env
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER as string,
      to: email,
      subject: subject,
      html: html,
    };

    const info: SentMessageInfo = await transporter.sendMail(mailOptions);
    console.log("Email sent: ", info.response);
    return info;
  } catch (error) {
    console.error("Error sending email: ", error);
    throw error;
  }
};
