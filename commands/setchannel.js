let allowedChannelId = null;

module.exports = (client) => {
  client.on("messageCreate", async (message) => {
    if (message.author.bot) return;

    // セットチャンネルコマンド
    if (message.content === "!setchannel") {
      allowedChannelId = message.channel.id;
      return message.reply("✅ このチャンネルをBotの使用チャンネルに設定しました");
    }

    // チャンネル未設定なら何もしない
    if (!allowedChannelId) return;

    // 指定チャンネル以外では無視
    if (message.channel.id !== allowedChannelId) return;

    // ↓↓↓ ここから下に「喋る処理」を書く ↓↓↓
  });
};
