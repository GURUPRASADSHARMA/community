import React from 'react'
import { resend } from '../lib/resend.js'

async function SendVerificationCode(email, username, verifyCode) {

    try {

      const url = "http://localhost:5173/verifyemail"
     const res =    await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: email,
            subject: "verification email CommunityBuilder",
            html: `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px; background-color: #f9f9f9;">
    <h2 style="color: #333;">Email Verification</h2>
    <p style="font-size: 16px; color: #555;">
      Hello,
    </p>
    <p style="font-size: 16px; color: #555;">
      Thank you for registering ${username} . Please use the verification code below to complete your signup:
    </p>
    <div style="font-size: 32px; font-weight: bold; color: #222; letter-spacing: 4px; text-align: center; margin: 20px 0;">
      ${verifyCode}
    </div>
    <p style="font-size: 14px; color: #777;">
      This code will expire in <strong>10 minutes</strong>. If you did not request this, you can ignore this email.
    </p>
     <p style="font-size: 14px; color: #777;">
      click to verify - ${url}
    </p>
    <p style="font-size: 14px; color: #bbb; margin-top: 30px;">
      – Your App Team
    </p>
  </div>`
        })
        return res
    } catch (error) {
        throw new Error("error during sending email verification code", error)
    }

}

export default SendVerificationCode
