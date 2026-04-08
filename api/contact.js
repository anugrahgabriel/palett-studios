export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, company, message } = req.body;

  // Basic validation
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;

  if (!SLACK_WEBHOOK_URL) {
    console.error('SLACK_WEBHOOK_URL is not defined in environment variables');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  const slackMessage = {
    text: `*New Contact Form Submission from Palett Studios*`,
    attachments: [
      {
        color: "#1E06D5",
        fields: [
          { title: "Name", value: name, short: true },
          { title: "Email", value: email, short: true },
          { title: "Company", value: company || 'Not provided', short: true },
          { title: "Message", value: message, short: false }
        ],
        footer: "Palett Studios Contact System",
        ts: Math.floor(Date.now() / 1000)
      }
    ]
  };

  try {
    const response = await fetch(SLACK_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(slackMessage),
    });

    if (response.ok) {
      return res.status(200).json({ success: true });
    } else {
      const errorText = await response.text();
      console.error('Slack API error:', errorText);
      return res.status(500).json({ error: 'Failed to send message to Slack' });
    }
  } catch (error) {
    console.error('Serverless function error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
