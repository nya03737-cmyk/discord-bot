module.exports = (client) => {
  client.on("messageCreate", async (message) => {
    if (message.author.bot) return;

    // コマンド
    if (message.content === "!setchannel") {
      // 管理者のみ
      if (!message.member.permissions.has("Administrator")) {
        return message.reply("管理者しか使えません");
      }

      const channel = message.channel;

      // 保存（超簡易：メモリ）
      client.setChannelId = channel.id;

      message.reply(`✅ このチャンネルをセットしました\n<#${channel.id}>`);
    }
  });
};
