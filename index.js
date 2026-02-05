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
client.on("messageCreate", message => {
  if (message.author.bot) return;

  if (message.content === "こんにちは") {
    message.reply("こんにちは！");
  }

  if (message.content === "!jinro") {
    message.channel.send(
      "🐺 人狼ゲームを開始します\n参加する人は `!join` と送ってください"
    );
  }

  if (message.content === "!join") {
    message.channel.send(`${message.author.username} が参加しました`);
  }
});
