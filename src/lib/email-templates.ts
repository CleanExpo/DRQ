import { ContactFormData } from "@/types/forms"

export const generateEmailTemplate = (data: ContactFormData) => {
  const urgencyColors = {
    high: "#ef4444",
    medium: "#f59e0b",
    low: "#3b82f6"
  };

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          .container { font-family: sans-serif; max-width: 600px; margin: 0 auto; }
          .header { padding: 20px; background: #f8fafc; }
          .content { padding: 20px; }
          .footer { padding: 20px; font-size: 12px; color: #64748b; }
          .urgency-badge {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            color: white;
            background: ${urgencyColors[data.urgency]};
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>New Contact Form Submission</h2>
            <span class="urgency-badge">${data.urgency.toUpperCase()} Priority</span>
          </div>
          <div class="content">
            <h3>Contact Details</h3>
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Phone:</strong> ${data.phone}</p>
            ${data.serviceType ? `<p><strong>Service Required:</strong> ${data.serviceType}</p>` : ''}
            
            <h3>Message</h3>
            <p>${data.message.replace(/\n/g, '<br/>')}</p>
          </div>
          <div class="footer">
            <p>Submitted via Disaster Recovery QLD website contact form</p>
            <p>Timestamp: ${new Date().toLocaleString('en-AU', { timeZone: 'Australia/Brisbane' })}</p>
          </div>
        </div>
      </body>
    </html>
  `
};
