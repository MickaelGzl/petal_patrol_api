import nodemailer from "nodemailer";
import pug from "pug";
import { join } from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

class Email {
  from;
  transporter;
  mailerPath = join(fileURLToPath(import.meta.url), "../");

  constructor() {
    this.from = "Petal Patrol <noreply@petal-patrol.fr>";

    if (process.env.NODE_ENV === "production") {
      this.transporter = nodemailer.createTransport({
        service: "gmail",
        host: process.env.NODEMAILER_HOST,
        port: process.env.NODEMAILER_PORT,
        secure: true,
        auth: {
          user: process.env.NODEMAILER_USER,
          pass: process.env.NODEMAILER_PASSWORD,
        },
        tls: {
          rejectUnauthorized: process.env.TLS_REJECT,
        },
      });
    } else {
      this.transporter = nodemailer.createTransport({
        //configure a mail tester for dev version, to not degrade our reputation
        host: process.env.NODEMAILER_HOST,
        port: process.env.NODEMAILER_PORT,
        auth: {
          user: process.env.NODEMAILER_USER,
          pass: process.env.NODEMAILER_PASSWORD,
        },
      });
    }
  }

  async sendResetPasswordLink(options) {
    // const mailerPath = join(fileURLToPath(import.meta.url), "../");
    try {
      await this.transporter.sendMail({
        from: this.from,
        to: options.to,
        subject: "Réinitialisation de votre mot de passe.",
        html: pug.renderFile(
          join(this.mailerPath, "/templates/resetPasswordTemplate.pug"),
          {
            email: options.to,
            url: `${options.url}/user/reset-password/${options.userId}/${options.token}/${options.serverToken}`,
          }
        ),
        attachments: [
          {
            filename: "grainou.png",
            path: join(
              this.mailerPath,
              "../assets/images/grainou_la_graine.png"
            ),
            cid: "unique@cid.ee",
          },
        ],
      });
      console.log("an email was sent for password reset");
    } catch (error) {
      throw error;
    }
  }

  async sendEmailVerificationLink(options) {
    try {
      await this.transporter.sendMail({
        from: this.from,
        to: options.to,
        subject: "Vérification de votre adresse email.",
        html: pug.renderFile(
          join(this.mailerPath, "/templates/validateEmailTemplate.pug"),
          {
            email: options.to,
            url: `${options.url}/auth/${options.token}`,
          }
        ),
        attachments: [
          {
            filename: "grainou.png",
            path: join(
              this.mailerPath,
              "../assets/images/grainou_la_graine.png"
            ),
            cid: "unique@cid.ee",
          },
        ],
      });
      console.log("an email was sent for email vérification");
    } catch (error) {
      throw error;
    }
  }
}

export const emailFactory = new Email();
