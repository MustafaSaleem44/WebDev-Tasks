import nodemailer from "nodemailer";

export async function sendEmail(to, subject, html) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.ethereal.email",
      port: Number(process.env.SMTP_PORT) || 587,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: '"Lead Management System" <no-reply@lms.local>',
      to,
      subject,
      html,
    });

    console.log("Message sent: %s", info.messageId);
    if (process.env.SMTP_HOST === "smtp.ethereal.email") {
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    }
  } catch (error) {
    console.error("Failed to send email", error);
  }
}

export const emailTemplates = {
  newLead: (leadName, budget) => `
    <h2>New Lead Alert</h2>
    <p>A new lead <strong>${leadName}</strong> has been created with a budget of <strong>Rs. ${budget.toLocaleString()}</strong>.</p>
    <p>Please log in to the dashboard to review.</p>
  `,
  leadAssigned: (leadName, agentName) => `
    <h2>Lead Assignment</h2>
    <p>The lead <strong>${leadName}</strong> has been assigned to <strong>${agentName}</strong>.</p>
  `
};
