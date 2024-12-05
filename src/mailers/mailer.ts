import { config } from "../config/app.config";
import { resend } from "./resendClient";

type Params = {
  to: string | string[];
  subject: string;
  text: string;
  html: string;
  from?: string;
};

const mailer_Sender =
  config.NODE_ENV === "development"
    ? `no-reply <onboarding@resend.dev>`
    : `no-reply <${config.MAILER_SENDER}>`;

export const sendEmail = async ({
  to,
  subject,
  text,
  html,
  from = mailer_Sender,
}: Params) => {
  return await resend.emails.send({
    from,
    to: Array.isArray(to) ? to : [to],
    subject,
    text,
    html,
  });
};
