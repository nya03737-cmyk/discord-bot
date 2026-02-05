 const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once("ready", () => {
  console.log("人狼ジャッジメント風Bot 起動！");
});

client.on("messageCreate", message => {
  if (message.author.bot) return;

  // あいさつ
  if (message.content === "こんにちは") {
    message.reply("こんにちは！");
  }

  // 人狼ジャッジメント風
  if (/怪しい|黒い|人狼/.test(message.content)) {
    const randomLines = [
      "そこ突っ込むの、ちょっと不自然じゃない？",
      "今の発言、後でログ見返したいですね。",
      "その視点、村っぽくはないかな。",
      "情報出さないのは人外要素ですよ？",
    ];
    message.reply(
      randomLines[Math.floor(Math.random() * randomLines.length)]
    );
  }

  // ゲーム開始
  if (message.content === "!jinro") {
    message.channel.send("🐺 人狼ゲームを開始します\n参加する人は `!join`");
  }

  if (message.content === "!join") {
    message.channel.send(`${message.author.username} が参加しました`);
  }
});

client.login(process.env.DISCORD_TOKEN); 
