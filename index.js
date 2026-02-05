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
    )
  }

  if (message.content === "!join") {
    message.channel.send(`${message.author.username} が参加しました`);
  }
});
const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once("ready", () => {
  console.log("人狼ジャッジメント風Bot 起動しました");
});

client.on("messageCreate", (message) => {
  if (message.author.bot) return;

  const text = message.content;

  // ===== 人狼ジャッジメント風 反応 =====

  if (/怪しい|黒い|人狼/.test(text)) {
    message.reply("その発言、だいぶ黒いですね…🤔");
    return;
  }

  if (/白|村人/.test(text)) {
    message.reply("白アピールですか？信用はしてませんよ😏");
    return;
  }

  if (/占い|占いました/.test(text)) {
    message.reply("CO確認。結果次第ですね。");
    return;
  }

  if (/吊り|処刑/.test(text)) {
    message.reply("感情吊りはやめましょう。理由をどうぞ。");
    return;
  }

  if (/スキップ/.test(text)) {
    message.reply("議論放棄は印象悪いですよ。");
    return;
  }

  if (/草|w{2,}/.test(text)) {
    message.reply("笑ってる余裕あります？議論中ですよ。");
    return;
  }

  // たまにランダム煽り
  if (Math.random() < 0.03) {
    const randomLines = [
      "そこ突っ込むの、ちょっと不自然じゃない？",
      "今の発言、後でログ見返したいですね。",
      "その視点、村っぽくはないかな。",
      "情報出さないのは人外利ですよ？",
    ];
    message.reply(
      randomLines[Math.floor(Math.random() * randomLines.length)]
    );
  }
});

client.login(process.env.DISCORD_TOKEN);
