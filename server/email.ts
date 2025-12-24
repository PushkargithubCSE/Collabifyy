import nodemailer from "nodemailer";
import "dotenv/config";

interface EmailConfig {
  email: string;
  name: string;
  userType: string;
}

// setting up transporter which will send the email
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

// function to send specific mail
export async function sendWaitlistEmail({
  email,
  name,
  userType,
}: EmailConfig): Promise<void> {
  const isCreator = userType === "creator";
  const userTypeLabel = isCreator ? "creator" : "brand";

  const htmlContent = `
  <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Collabifyy</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="width: 100%; max-width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); border-radius: 16px 16px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">
                ✨ Collabifyy
              </h1>
              <p style="margin: 8px 0 0; color: rgba(255, 255, 255, 0.9); font-size: 16px;">
                Where Brands Meet Creators
              </p>
            </td>
          </tr>
          
          <!-- Main Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 16px; color: #18181b; font-size: 24px; font-weight: 600;">
                Welcome aboard, ${name}! 🎉
              </h2>
              
              <p style="margin: 0 0 24px; color: #52525b; font-size: 16px; line-height: 1.6;">
                Thank you for joining the Collabifyy waitlist as a <strong style="color: #6366f1;">${userTypeLabel}</strong>. 
                We're thrilled to have you with us on this exciting journey!
              </p>
              
              <div style="background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%); border-radius: 12px; padding: 24px; margin: 24px 0;">
                <h3 style="margin: 0 0 12px; color: #6366f1; font-size: 18px; font-weight: 600;">
                  What happens next?
                </h3>
                <ul style="margin: 0; padding: 0 0 0 20px; color: #52525b; font-size: 15px; line-height: 1.8;">
                  <li>You're now on our exclusive early access list</li>
                  <li>We'll notify you as soon as the platform launches</li>
                  <li>Early waitlist members get special perks!</li>
                </ul>
              </div>
              
              <p style="margin: 24px 0; color: #52525b; font-size: 16px; line-height: 1.6;">
                ${
                  isCreator
                    ? "Get ready to connect with amazing brands and unlock collaboration opportunities tailored to your unique voice."
                    : "Get ready to discover talented creators who can amplify your brand's message authentically."
                }
              </p>
              
              <p style="margin: 24px 0 0; color: #71717a; font-size: 14px; line-height: 1.6;">
                Have questions? Simply reply to this email, and we'll get back to you!
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px; background-color: #fafafa; border-radius: 0 0 16px 16px; text-align: center; border-top: 1px solid #e4e4e7;">
              <p style="margin: 0; color: #a1a1aa; font-size: 13px;">
                © ${new Date().getFullYear()} Collabifyy. All rights reserved.
              </p>
              <p style="margin: 8px 0 0; color: #a1a1aa; font-size: 12px;">
                You received this email because you signed up for the Collabifyy waitlist.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  const mailOptions = {
    from: `"Collabifyy" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: `${name}, You are on the Collabifyy waitlist`,
    html: htmlContent,
    text: `Welcome to Collabifyy, ${name}!
    
Thanks for joining the Collabifyy waitlist as a ${userTypeLabel}. We are thrilled to have you with us!

${
  isCreator
    ? "Get ready to connect with amazing brands and unlock collaboration opportunities tailored to your unique voice."
    : "Get ready to discover talented creators who can amplify your brand's message authentically."
}

Have any questions? Simply reply to this email!

© ${new Date().getFullYear()} Collabifyy. All rights reserved.
`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Waitlist acknowledgment email sent to: ${email}`);
    console.log("✅ Email sent successfully!");
    console.log("📨 Message ID:", info.messageId);
  } catch (err) {
    console.log("Error sending Email: ", err);
    throw err;
  }
}
