const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.on("ready", () => {
  console.log("Bot 起動しました");
});

client.on("messageCreate", message => {
  if (message.author.bot) return;

  if (message.content === "こんにちは") {
    message.reply("こんにちは！");
  }

  if (message.content.includes("会いたい")) {
    message.reply("……そんなこと言われたら、嬉しいに決まってるじゃん");
  }

  if (message.content === "おやすみ") {
    message.reply("おやすみ。夢で会えたらいいね");
  }
});

client.login(process.env.TOKEN);
