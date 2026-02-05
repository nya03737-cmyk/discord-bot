const { Client, GatewayIntentBits, Collection } = require("discord.js");
const fs = require("fs");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// コマンド管理
client.commands = new Collection();

// 状態管理（セットチャンネルなど）
const state = {
  allowedChannelId: null,
};

// commands 読み込み
const commandFiles = fs
  .readdirSync("./commands")
  .filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

// wolf機能
require("./features/wolf")(client, state);

// スラッシュコマンド処理
client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction, state);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "❌ コマンド実行中にエラーが発生しました",
      ephemeral: true,
    });
  }
});

client.once("ready", () => {
  console.log("🤖 Bot起動完了");
});

client.login(process.env.TOKEN);
