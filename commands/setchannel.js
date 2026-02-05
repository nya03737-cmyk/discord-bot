const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setchannel")
    .setDescription("Botが反応するチャンネルをこのチャンネルに設定します"),

  async execute(interaction, state) {
    state.allowedChannelId = interaction.channelId;

    await interaction.reply({
      content: "✅ このチャンネルをBotの使用チャンネルに設定しました",
      ephemeral: true
    });
  }
};
