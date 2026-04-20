import { Injectable } from '@nestjs/common'

@Injectable()
export class EmailService {
  private apiKey: string
  private fromEmail: string

  constructor() {
    this.apiKey = process.env.RESEND_API_KEY || 're_UKoUQkes_7QTkAVLJr8kSvBprVjmoAtQo'
    this.fromEmail = process.env.FROM_EMAIL || 'onboarding@resend.dev'
  }

  async sendEmail(to: string, subject: string, html: string) {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: `ChurchesOS <${this.fromEmail}>`,
          to: [to],
          subject,
          html,
        }),
      })
      const data = await response.json()
      if (response.ok) {
        console.log(`[EMAIL] Sent to ${to}: ${subject}`)
        return { success: true, id: (data as any).id }
      } else {
        console.error('[EMAIL] Error:', data)
        return { success: false, error: data }
      }
    } catch(e) {
      console.error('[EMAIL] Exception:', e)
      return { success: false }
    }
  }

  async sendWelcomeEmail(churchName: string, email: string, password: string) {
    return this.sendEmail(email, `Welcome to ChurchesOS - ${churchName}`, `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px">
        <div style="background:#1B4FD8;padding:20px;border-radius:12px;text-align:center;margin-bottom:20px">
          <h1 style="color:white;margin:0">ChurchesOS</h1>
        </div>
        <h2 style="color:#0F172A">Welcome, ${churchName}!</h2>
        <p>Your church has been successfully registered on ChurchesOS.</p>
        <div style="background:#F8FAFF;padding:16px;border-radius:8px;margin:20px 0">
          <p style="margin:0"><strong>Email:</strong> ${email}</p>
          <p style="margin:8px 0 0"><strong>Password:</strong> ${password}</p>
        </div>
        <a href="https://churches-os.vercel.app/login" 
           style="display:inline-block;background:#1B4FD8;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;margin-top:10px">
          Login to Dashboard
        </a>
        <p style="color:#6B7280;margin-top:20px;font-size:14px">Please change your password after first login.</p>
        <p style="color:#6B7280;font-size:14px">Best regards,<br/>ChurchesOS Team</p>
      </div>
    `)
  }

  async sendNewRegistrationEmail(churchName: string, pastorName: string, adminEmail: string) {
    return this.sendEmail(adminEmail, `New Church Registered - ${churchName}`, `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px">
        <div style="background:#1B4FD8;padding:20px;border-radius:12px;text-align:center;margin-bottom:20px">
          <h1 style="color:white;margin:0">ChurchesOS</h1>
        </div>
        <h2 style="color:#0F172A">New Church Registration</h2>
        <div style="background:#F8FAFF;padding:16px;border-radius:8px;margin:20px 0">
          <p style="margin:0"><strong>Church:</strong> ${churchName}</p>
          <p style="margin:8px 0 0"><strong>Pastor:</strong> ${pastorName}</p>
        </div>
        <a href="https://churches-os.vercel.app/admin-login"
           style="display:inline-block;background:#1B4FD8;color:white;padding:12px 24px;border-radius:8px;text-decoration:none">
          View in Super Admin
        </a>
      </div>
    `)
  }

  async sendPaymentApprovedEmail(churchName: string, plan: string, email: string) {
    return this.sendEmail(email, `Your Plan Is Now Active - ChurchesOS`, `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px">
        <div style="background:#059669;padding:20px;border-radius:12px;text-align:center;margin-bottom:20px">
          <h1 style="color:white;margin:0">✅ Plan Activated!</h1>
        </div>
        <h2 style="color:#0F172A">Congratulations, ${churchName}!</h2>
        <p>Your payment has been verified and your <strong>${plan}</strong> plan is now active.</p>
        <p>You can now access all features included in your plan.</p>
        <a href="https://churches-os.vercel.app/login"
           style="display:inline-block;background:#059669;color:white;padding:12px 24px;border-radius:8px;text-decoration:none">
          Login to Dashboard
        </a>
        <p style="color:#6B7280;margin-top:20px;font-size:14px">Best regards,<br/>ChurchesOS Team</p>
      </div>
    `)
  }

  async sendPaymentRejectedEmail(churchName: string, plan: string, email: string) {
    return this.sendEmail(email, `Payment Not Verified - ChurchesOS`, `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px">
        <div style="background:#DC2626;padding:20px;border-radius:12px;text-align:center;margin-bottom:20px">
          <h1 style="color:white;margin:0">Payment Not Verified</h1>
        </div>
        <h2 style="color:#0F172A">Dear ${churchName},</h2>
        <p>We could not verify your payment for the <strong>${plan}</strong> plan.</p>
        <p>Please contact support or resubmit your payment proof.</p>
        <a href="https://churches-os.vercel.app/login"
           style="display:inline-block;background:#1B4FD8;color:white;padding:12px 24px;border-radius:8px;text-decoration:none">
          Login to Dashboard
        </a>
        <p style="color:#6B7280;margin-top:20px;font-size:14px">Best regards,<br/>ChurchesOS Team</p>
      </div>
    `)
  }
}
