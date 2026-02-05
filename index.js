const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// ==============================
// セットチャンネル（共有状態）
// ==============================
client.allowedChannelId = null;

// ==============================
// 起動
// ==============================
client.once("ready", () => {
  console.log("🐺 WOLF Bot 起動");
});

// ==============================
// セットチャンネルコマンド
// ==============================
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  if (message.content === "!setchannel") {
    if (!message.member.permissions.has("Administrator")) {
      return message.reply("❌ 管理者のみ使用できます");
    }

    client.allowedChannelId = message.channel.id;
    return message.reply("✅ このチャンネルをセットしました");
  }
});

// ==============================
// WOLF（変更なし）
// ==============================
require("./features/wolf")(client);

// ==============================
client.login(process.env.TOKEN);
