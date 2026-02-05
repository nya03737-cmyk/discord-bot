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
// セット / 解除 コマンド（誰でもOK）
// ==============================
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  // ===== セット =====
  if (message.content === "!setchannel") {
    client.allowedChannelId = message.channel.id;
    return message.reply("✅ さあ！行くぞ！");
  }

  // ===== 解除 =====
  if (message.content === "!unsetchannel") {
    client.allowedChannelId = null;
    return message.reply("🔓 もう喋んなってこと？");
  }
});

// ==============================
// WOLF（機能本体）
// ==============================
require("./features/wolf")(client);

// ==============================
client.login(process.env.TOKEN);
