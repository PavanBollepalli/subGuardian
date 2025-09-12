import nodemailer from 'nodemailer';
import { EMAIL_PASSWORD } from './env.js';
export const accountEmail = 'pavanvenkatanagamanoj@gmail.com';

// Check if EMAIL_PASSWORD is set
if (!EMAIL_PASSWORD) {
  console.error('EMAIL_PASSWORD is not set in environment variables. Please set it to your Gmail app password.');
}

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: accountEmail,
    pass: EMAIL_PASSWORD
  }
});

export default transporter;