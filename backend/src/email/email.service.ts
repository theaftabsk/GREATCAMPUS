import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(private prisma: PrismaService) {}

  async getSmtpConfig() {
    let config = await this.prisma.smtpConfig.findFirst();
    if (!config) {
      config = await this.prisma.smtpConfig.create({
        data: {
          tenantId: 'default-tenant',
          host: process.env.SMTP_HOST || 'smtp.gmail.com',
          port: Number(process.env.SMTP_PORT) || 587,
          username: process.env.SMTP_USER || '',
          password: process.env.SMTP_PASSWORD || '',
          encryption: process.env.SMTP_SECURE === 'true' ? 'SSL' : 'TLS',
          fromName: process.env.SMTP_FROM_NAME || 'Niva Bupa Recruitment Team',
          fromEmail: process.env.SMTP_FROM_EMAIL || 'recruitment@greatcampus.in',
        },
      });
    }
    return config;
  }

  async saveSmtpConfig(data: {
    host: string;
    port: number;
    username: string;
    password?: string;
    encryption: string;
    fromName: string;
    fromEmail: string;
  }) {
    const existing = await this.getSmtpConfig();
    const updateData: any = {
      host: data.host,
      port: Number(data.port),
      username: data.username,
      encryption: data.encryption,
      fromName: data.fromName,
      fromEmail: data.fromEmail,
    };
    if (data.password && data.password.trim() !== '') {
      updateData.password = data.password;
    }

    return this.prisma.smtpConfig.update({
      where: { id: existing.id },
      data: updateData,
    });
  }

  private async createTransporter() {
    const config = await this.getSmtpConfig();
    const isSecure = config.encryption === 'SSL' || config.port === 465;

    return nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: isSecure,
      auth: config.username && config.password ? {
        user: config.username,
        pass: config.password,
      } : undefined,
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  async testConnection(targetEmail?: string) {
    try {
      const config = await this.getSmtpConfig();
      if (!config.username || !config.password) {
        return {
          success: false,
          message: 'SMTP credentials missing. Please enter your SMTP Username and Password/App Password.',
        };
      }

      const transporter = await this.createTransporter();

      // Verify SMTP connection
      await transporter.verify();

      // Send a test mail if targetEmail provided
      const recipient = targetEmail || config.username || config.fromEmail;
      if (recipient) {
        await transporter.sendMail({
          from: `"${config.fromName}" <${config.fromEmail}>`,
          to: recipient,
          subject: '✅ SMTP Connection Test — Niva Bupa Assessment Portal',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 540px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;">
              <h2 style="color: #003F72; margin-top: 0;">Niva Bupa Assessment Tool</h2>
              <p style="color: #334155; font-size: 14px; line-height: 1.6;">
                This is a test email confirming that your authenticated SMTP mail server configuration is working correctly!
              </p>
              <div style="background: #f8fafc; border: 1px solid #cbd5e1; padding: 12px 16px; border-radius: 8px; font-size: 13px; color: #475569;">
                <strong>Host:</strong> ${config.host}<br/>
                <strong>Port:</strong> ${config.port}<br/>
                <strong>Sender:</strong> ${config.fromName} (${config.fromEmail})<br/>
                <strong>Timestamp:</strong> ${new Date().toLocaleString()}
              </div>
            </div>
          `,
        });
      }

      return {
        success: true,
        message: `SMTP connection established successfully! Test email delivered to ${recipient}.`,
      };
    } catch (err: any) {
      this.logger.error(`SMTP Test error: ${err.message}`);
      return {
        success: false,
        message: `SMTP Connection Failed: ${err.message}. Please check your SMTP host, port, user, and App Password.`,
      };
    }
  }

  buildInvitationEmailHtml(data: {
    candidateName: string;
    assessmentName: string;
    durationMins: number;
    examUrl: string;
    activeUntil?: string;
  }) {
    const { candidateName, assessmentName, durationMins, examUrl, activeUntil } = data;

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,63,114,0.08); border: 1px solid #e2e8f0; }
          .header { background: linear-gradient(135deg, #003F72 0%, #00AEEF 100%); padding: 32px 28px; text-align: center; color: white; }
          .header h1 { margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.3px; }
          .header p { margin: 6px 0 0; font-size: 13px; opacity: 0.9; }
          .body { padding: 32px 28px; color: #1e293b; line-height: 1.6; }
          .greeting { font-size: 16px; font-weight: 700; color: #0f172a; margin-bottom: 12px; }
          .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; margin: 20px 0; }
          .card-row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 13px; }
          .card-row:last-child { margin-bottom: 0; }
          .btn-container { text-align: center; margin: 32px 0 20px; }
          .btn { display: inline-block; background: linear-gradient(135deg, #0090C8 0%, #00AEEF 100%); color: #ffffff !important; text-decoration: none; font-weight: 800; font-size: 15px; padding: 14px 36px; border-radius: 12px; box-shadow: 0 4px 14px rgba(0,174,239,0.35); }
          .instructions { background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 10px; padding: 14px 18px; font-size: 12px; color: #1e40af; margin-top: 24px; }
          .instructions ul { margin: 6px 0 0; padding-left: 18px; }
          .footer { background: #f8fafc; padding: 20px; text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid #e2e8f0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Niva Bupa Health Insurance</h1>
            <p>ARM Banca Recruitment & Capability Assessment Portal</p>
          </div>
          <div class="body">
            <div class="greeting">Dear ${candidateName},</div>
            <p style="font-size: 14px; color: #334155;">
              You have been scheduled to undertake the official <strong>${assessmentName}</strong>. This assessment evaluates core competencies for the Agency Unit Manager & ARM Banca role.
            </p>

            <div class="card">
              <div style="font-size: 13px; font-weight: 700; color: #003F72; margin-bottom: 10px;">📋 Assessment Summary</div>
              <div style="font-size: 13px; color: #475569; margin-bottom: 6px;"><strong>Assessment:</strong> ${assessmentName}</div>
              <div style="font-size: 13px; color: #475569; margin-bottom: 6px;"><strong>Duration:</strong> ${durationMins} Minutes</div>
              <div style="font-size: 13px; color: #475569; margin-bottom: 6px;"><strong>Total Questions:</strong> 60 Questions (6 Sections)</div>
              ${activeUntil ? `<div style="font-size: 13px; color: #475569;"><strong>Valid Until:</strong> ${new Date(activeUntil).toLocaleDateString()} ${new Date(activeUntil).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>` : ''}
            </div>

            <div class="btn-container">
              <a href="${examUrl}" class="btn" target="_blank">Start Assessment Now →</a>
            </div>

            <div class="instructions">
              <strong>⚠️ Proctoring & Exam Guidelines:</strong>
              <ul>
                <li>Ensure you are in a well-lit room with working webcam enabled.</li>
                <li>Do not switch tabs, minimize the browser, or exit fullscreen during the exam.</li>
                <li>3 proctoring warnings will automatically lock your exam session.</li>
                <li>All answers are saved automatically in real-time.</li>
              </ul>
            </div>

            <p style="font-size: 12px; color: #94a3b8; margin-top: 24px; word-break: break-all;">
              If the button above does not work, copy and paste this link into your browser:<br/>
              <a href="${examUrl}" style="color: #00AEEF;">${examUrl}</a>
            </p>
          </div>
          <div class="footer">
            &copy; ${new Date().getFullYear()} Niva Bupa Health Insurance Company Limited. Powered by GreatCampus Assessment Platform.
          </div>
        </div>
      </body>
      </html>
    `;
  }

  async sendCandidateInvitation(candidateId: string) {
    const candidate = await this.prisma.candidate.findUnique({
      where: { id: candidateId },
      include: { assessment: true },
    });
    if (!candidate) throw new NotFoundException('Candidate not found.');

    const config = await this.getSmtpConfig();
    if (!config.username || !config.password) {
      await this.prisma.candidate.update({
        where: { id: candidate.id },
        data: { emailStatus: 'FAILED' },
      });
      return {
        success: false,
        message: 'SMTP credentials not configured. Please enter your SMTP Username & App Password in System Settings.',
        error: 'SMTP_NOT_CONFIGURED',
      };
    }

    const transporter = await this.createTransporter();

    const frontendBaseUrl = process.env.CANDIDATE_PORTAL_URL || process.env.FRONTEND_CANDIDATE_URL || 'https://niva.greatcampus.in';
    const examUrl = `${frontendBaseUrl}/${candidate.assessment.slug}?token=${candidate.secureToken || candidate.id}`;
    const subject = `Assessment Invitation: ${candidate.assessment.name} — Niva Bupa`;

    const htmlContent = this.buildInvitationEmailHtml({
      candidateName: candidate.name,
      assessmentName: candidate.assessment.name,
      durationMins: candidate.assessment.durationMins || 45,
      examUrl,
      activeUntil: candidate.assessment.activeUntil ? candidate.assessment.activeUntil.toISOString() : undefined,
    });

    let emailLog = await this.prisma.emailLog.create({
      data: {
        candidateId: candidate.id,
        recipientEmail: candidate.email,
        candidateName: candidate.name,
        assessmentName: candidate.assessment.name,
        assessmentId: candidate.assessmentId,
        subject,
        status: 'PENDING',
      },
    });

    try {
      await transporter.sendMail({
        from: `"${config.fromName}" <${config.fromEmail}>`,
        to: candidate.email,
        subject,
        html: htmlContent,
      });

      emailLog = await this.prisma.emailLog.update({
        where: { id: emailLog.id },
        data: {
          status: 'SENT',
          sentAt: new Date(),
          errorMessage: null,
        },
      });

      await this.prisma.candidate.update({
        where: { id: candidate.id },
        data: {
          emailStatus: 'SENT',
          emailSentAt: new Date(),
        },
      });

      return {
        success: true,
        message: `Invitation sent successfully to ${candidate.email}`,
        emailLogId: emailLog.id,
      };
    } catch (err: any) {
      this.logger.error(`Failed to send email to ${candidate.email}: ${err.message}`);

      try {
        await this.prisma.emailLog.update({
          where: { id: emailLog.id },
          data: {
            status: 'FAILED',
            errorMessage: err.message,
          },
        });
      } catch (_) {}

      try {
        await this.prisma.candidate.update({
          where: { id: candidate.id },
          data: { emailStatus: 'FAILED' },
        });
      } catch (_) {}

      return {
        success: false,
        message: `Email dispatch failed: ${err.message}`,
        error: err.message,
      };
    }
  }

  async sendBulkInvitations(data: { assessmentId: string; candidateIds?: string[] }) {
    const { assessmentId, candidateIds } = data;

    const config = await this.getSmtpConfig();
    const isSmtpConfigured = !!(config.username && config.password);

    const candidates = await this.prisma.candidate.findMany({
      where: {
        assessmentId,
        ...(candidateIds && candidateIds.length > 0 && { id: { in: candidateIds } }),
      },
      include: { assessment: true },
    });

    if (candidates.length === 0) {
      return { success: true, total: 0, sent: 0, failed: 0, errors: [] };
    }

    if (!isSmtpConfigured) {
      // Mark candidates as FAILED with clear reason
      await this.prisma.candidate.updateMany({
        where: { id: { in: candidates.map((c) => c.id) } },
        data: { emailStatus: 'FAILED' },
      });

      return {
        success: false,
        total: candidates.length,
        sent: 0,
        failed: candidates.length,
        message: 'SMTP Credentials Not Configured: Please configure SMTP Host, Username, and Password in System Settings before sending real emails.',
        errors: candidates.map((c) => ({
          email: c.email,
          error: 'SMTP not configured in System Settings (/admin/settings).',
        })),
      };
    }

    let sent = 0;
    let failed = 0;
    const errors: Array<{ email: string; error: string }> = [];

    // Process in batches of 5
    const batchSize = 5;
    for (let i = 0; i < candidates.length; i += batchSize) {
      const batch = candidates.slice(i, i + batchSize);
      await Promise.all(
        batch.map(async (candidate) => {
          const res = await this.sendCandidateInvitation(candidate.id);
          if (res.success) {
            sent++;
          } else {
            failed++;
            errors.push({ email: candidate.email, error: res.message || 'Send error' });
          }
        }),
      );
    }

    return {
      success: sent > 0,
      total: candidates.length,
      sent,
      failed,
      errors,
    };
  }

  async resendEmail(emailLogId: string) {
    const log = await this.prisma.emailLog.findUnique({
      where: { id: emailLogId },
      include: { candidate: { include: { assessment: true } } },
    });
    if (!log || !log.candidate) throw new NotFoundException('Email log / Candidate record not found.');

    return this.sendCandidateInvitation(log.candidate.id);
  }

  async getEmailLogs(query: {
    page?: number;
    limit?: number;
    assessmentId?: string;
    status?: string;
    search?: string;
  }) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 50;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (query.assessmentId) where.assessmentId = query.assessmentId;
    if (query.status && query.status !== 'ALL') where.status = query.status;
    if (query.search) {
      where.OR = [
        { recipientEmail: { contains: query.search, mode: 'insensitive' } },
        { candidateName: { contains: query.search, mode: 'insensitive' } },
        { subject: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [logs, total] = await Promise.all([
      this.prisma.emailLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.emailLog.count({ where }),
    ]);

    return {
      success: true,
      logs,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }
}
