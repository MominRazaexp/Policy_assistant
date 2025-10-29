import axios from "axios";
import GeneratedDraft from "../models/GeneratedDraft.js";

export const sendToSlack = async (req, res) => {
  const { text, draftId, channel } = req.body;

  if (!text || !channel) {
    return res.status(400).json({ status: "error", message: "text and channel are required" });
  }

  try {

    const webhooks = {
      social: process.env.SLACK_WEBHOOK_SOCIAL,
      "new-channel": process.env.SLACK_WEBHOOK_NEW_CHANNEL,
      momin_hr: process.env.SLACK_WEBHOOK_MOMIN_HR
    };

    const webhookUrl = webhooks[channel];
    if (!webhookUrl) {
      return res.status(400).json({ status: "error", message: `Invalid channel: ${channel}` });
    }

    const response = await axios.post(webhookUrl, { text });


    if (draftId) {
      await GeneratedDraft.findByIdAndUpdate(draftId, { status: `sent_${channel}` });
    }

    res.json({ status: "ok", slack: response.data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: err.message });
  }
};
