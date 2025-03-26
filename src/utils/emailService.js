// src/utils/emailService.js
import { Resend } from 'resend';

const resend = new Resend(process.env.REACT_APP_RESEND_API_KEY);

export async function sendOrderEmail(orderDetails) {
  const { error } = await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: orderDetails.email,
    subject: 'Order Confirmation',
    html: `<h2>Thank you for your order, ${orderDetails.name}!</h2>
           <p>Order Message: $${orderDetails.notes}</p>`,
  });

  if (error) {
    console.error('Error sending email:', error);
  } else {
    console.log('Email sent successfully');
  }
}
