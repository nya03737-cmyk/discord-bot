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

  // 人狼ジャッジメント風・完全ランダム反応
const autoReplies = [
  "今の発言、ちょっと雑じゃない？",
  "その視点、どこから出てきたの？",
  "無難すぎて逆に怪しい。",
  "今のタイミングでそれ言う？",
  "情報落としてないよね。",
  "それ、村利になってる？",
  "発言数稼いでるだけに見える。",
  "その動き、前世で見た。",
  "論点ずらしてない？",
  "その意見、誰かに乗っかってない？",
  "庇い方が不自然。",
  "慎重すぎるのも怪しいけどね。",
  "今の発言、後で検証対象ね。",
  "視点が一人だけズレてる気がする。",
  "今ログ見返したら矛盾ありそう。",
  "発言の割に中身薄くない？",
  "それ言うなら根拠欲しい。",
  "そのムーブ、かなり人外寄り。",
  "今のは黒要素拾える。",
  "逆に今それ言わない方が良くない？",
  "その動き、噛まれたくない人外っぽい。",
  "ちょっと警戒した方が良さそう。",
  "今のは吊り位置に上がる発言だね。",
  "その意見、昨日と違わない？",
  "様子見しすぎじゃない？",
  "今のは村アピに見える。",
  "その発言、後でログ残そう。",
  "今のムーブ、露骨すぎる。",
  "そこ突っ込むの、ちょっと不自然。",
  "一旦落ち着いて整理しよう。",
];

// bot以外＆一定確率で反応
if (!message.author.bot && Math.random() < 0.25) {
  message.reply(
    autoReplies[Math.floor(Math.random() * autoReplies.length)]
  );
}
 client.login(process.env.TOKEN);
