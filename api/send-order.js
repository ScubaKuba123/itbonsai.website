import nodemailer from "nodemailer";

const recipient = "studio@itbonsai.pl";
const defaultHost = "smtp.hostinger.com";
const defaultPort = 465;

const readJson = async (req) => {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string") return JSON.parse(req.body);

  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
};

const getSmtpConfig = () => {
  const host = process.env.SMTP_HOST || defaultHost;
  const port = Number(process.env.SMTP_PORT || defaultPort);
  const user = process.env.SMTP_USER || recipient;
  const pass = process.env.SMTP_PASSWORD || process.env.SMTP_PASS;

  return {
    host,
    port,
    secure: port === 465,
    auth: pass ? { user, pass } : null,
  };
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body = await readJson(req);
    const subject =
      typeof body.subject === "string" && body.subject.trim()
        ? body.subject.trim().slice(0, 180)
        : "New BonsAi Studio order";
    const text =
      typeof body.message === "string" && body.message.trim()
        ? body.message.trim().slice(0, 40000)
        : "";

    if (!text) {
      return res.status(400).json({ error: "Missing order brief." });
    }

    const smtp = getSmtpConfig();

    if (!smtp.auth) {
      return res.status(503).json({
        error:
          "SMTP is not configured yet. Add SMTP_PASS in Vercel for studio@itbonsai.pl, then redeploy.",
      });
    }

    const transporter = nodemailer.createTransport({
      host: smtp.host,
      port: smtp.port,
      secure: smtp.secure,
      auth: smtp.auth,
    });

    const info = await transporter.sendMail({
      from: `"BonsAi Studio Workshop" <${smtp.auth.user}>`,
      to: recipient,
      replyTo: recipient,
      subject,
      text,
    });

    return res.status(200).json({
      ok: true,
      id: info.messageId,
      providerResponse: "sent",
    });
  } catch (error) {
    console.error("Order email failed", error);
    return res.status(400).json({
      error:
        error instanceof Error
          ? error.message
          : "Email could not be sent. Please check SMTP settings.",
    });
  }
}
