import { env } from "@/lib/env";
import ky from "ky";

export async function sendFeedbackMessage({
  channelId,
  type,
  subject,
  content,
  email,
  image,
}: {
  channelId: string;
  type: string;
  subject: string;
  content: string;
  email?: string;
  image?: string;
}) {
  const feedbackMessage: any = {
    embeds: [
      {
        color:
          type === "Bug"
            ? 0xff0000
            : type === "Suggestion"
            ? 0x00ff00
            : 0x0000ff, // Red for bugs, green for suggestions, blue for general
        image: image
          ? {
              url: `attachment://feedback-image-${Date.now()}.png`, // Referencing the uploaded image
            }
          : undefined,
      },
    ],
  };

  if (image) {
    feedbackMessage.files = [
      {
        attachment: Buffer.from(image.split(",")[1], "base64"),
        name: `feedback-image-${Date.now()}.png`,
      },
    ];
  }

  await ky.post(`https://discord.com/api`, {
    headers: {
      Authorization: `Bot ${env.DISCORD_TOKEN}`,
      "Content-Type": "application/json",
    },
    json: {
      embeds: [
        {
          title: type,
          description: `**${subject}**\n${content} `,
          fields: [
            email
              ? { name: "Email", value: email }
              : { name: "Email", value: "Anonymous" },
          ],
          color:
            type === "Bug"
              ? 0xff0000
              : type === "Suggestion"
              ? 0x00ff00
              : 0x0000ff, // Red for bugs, green for suggestions, blue for general
        },
      ],
      attachments: [
        {
          name: `feedback-image-${Date.now()}.png`,
          attachment: Buffer.from(image.split(",")[1], "base64"),
        },
      ],
    },
  });
}
