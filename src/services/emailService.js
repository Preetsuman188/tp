// Email sending via EmailJS REST API.
// Requires the following Vite env vars to be set:
// VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, VITE_EMAILJS_PUBLIC_KEY
// Template params expected: to_email, subject, message.
const EMAILJS_ENDPOINT = "https://api.emailjs.com/api/v1.0/email/send";

function getEmailJsConfig() {
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
  return { serviceId, templateId, publicKey };
}

export async function sendRequestEmails({ emails, title, deadline, link, subject, body }) {
  const { serviceId, templateId, publicKey } = getEmailJsConfig();

  if (!serviceId || !templateId || !publicKey) {
    console.warn("EmailJS config missing, skipping email send.");
    return { delivered: false, reason: "missing-config" };
  }

  if (!emails || emails.length === 0) {
    console.warn("No recipient emails provided, skipping email send.");
    return { delivered: false, reason: "no-recipients" };
  }

  const payload = {
    service_id: serviceId,
    template_id: templateId,
    user_id: publicKey,
    template_params: {
      to_email: emails.join(","),
      subject: subject || `Data request: ${title}`,
      message:
        body ||
        `Hi team,\n\nPlease submit the requested data here: ${link}\nDeadline: ${deadline || "Not specified"}\n\nThank you.`,
    },
  };

  const res = await fetch(EMAILJS_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Email send failed: ${res.status} ${text}`);
  }

  return { delivered: true };
}

export async function sendReminderEmails({ emails, title, nextReminder }) {
  const { serviceId, templateId, publicKey } = getEmailJsConfig();
  if (!serviceId || !templateId || !publicKey || !emails?.length) return;

  const payload = {
    service_id: serviceId,
    template_id: templateId,
    user_id: publicKey,
    template_params: {
      to_email: emails.join(","),
      subject: `Reminder: ${title}`,
      message: `Friendly reminder: next reminder is scheduled on ${nextReminder}.`,
    },
  };

  await fetch(EMAILJS_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}
