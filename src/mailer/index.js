import nodemailer from "nodemailer";
import pug from "pug";
import { join } from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

class Email {
  from;
  transporter;

  constructor() {
    this.from = "Petal Patrol <noreply@petal-patrol.fr>";

    if (process.env.NODE_ENV === "production") {
      this.transporter = nodemailer.createTransport(
        sparkPostTransporter({
          sparkPostApiKey: "",
          endPoint: "",
        })
      );
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
    const mailerPath = join(fileURLToPath(import.meta.url), "../");
    try {
      await this.transporter.sendMail({
        from: this.from,
        to: options.to,
        subject: "Réinitialisation de votre mot de passe.",
        html: pug.renderFile(
          join(mailerPath, "/templates/resetPasswordTemplate.pug"),
          {
            email: options.to,
            url: `${options.url}/user/reset-password/${options.userId}/${options.token}/${options.serverToken}`,
          }
        ),
        attachments: [
          {
            filename: "grainou.png",
            path: join(mailerPath, "../assets/images/grainou_la_graine.png"),
            cid: "unique@cid.ee",
          },
        ],
      });
      console.log("an email was sent for password reset");
    } catch (error) {
      throw error;
    }
  }

  async sendEmailVerificationLink(options) {}
}

export const emailFactory = new Email();
