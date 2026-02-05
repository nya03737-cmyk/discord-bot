const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// ===== 人狼AI 状態管理 =====
const userStats = {};
let globalTurn = 0;

client.once("ready", () => {
  console.log("🐺 人狼ジャッジメント風Bot 起動！");
});

client.on("messageCreate", async message => {
  if (message.author.bot) return;

  globalTurn++;

  const userId = message.author.id;

  // 初期化
  if (!userStats[userId]) {
    userStats[userId] = {
      count: 0,
      suspicion: Math.random() * 0.4,
      locked: false,
    };
  }

  const user = userStats[userId];
  user.count++;

  // 発言数多いほど疑われる
  user.suspicion += 0.04;

  // たまにロックオン
  if (!user.locked && Math.random() < 0.05) {
    user.locked = true;
    user.suspicion += 0.3;
  }

  // 反応確率（盤面が進むほど増加）
  const reactChance = Math.min(
    0.12 + user.suspicion * 0.25 + globalTurn * 0.002,
    0.65
  );
  if (Math.random() > reactChance) return;

  // 人間っぽい遅延
  await new Promise(r =>
    setTimeout(r, 1000 + Math.random() * 2500)
  );

  // ===== 発言バリエーション =====

  const lightReplies = [
    "まだ判断材料足りないかな。",
    "今は保留で見てる。",
    "その発言自体は普通。",
    "一旦メモだけ。",
    "焦る時間帯じゃない。",
    "今はフラット。",
    "そこまで違和感はない。",
    "今日触る位置ではなさそう。",
  ];

  const suspiciousReplies = [
    "発言数の割に中身薄くない？",
    "その視点、どこから来た？",
    "今その話題出す意味ある？",
    "ちょっと動き早い気がする。",
    "発言稼ぎっぽく見える。",
    "視点が浮いてるんだよね。",
    "庇いに見えるのが気になる。",
    "今のは色落ちしない発言。",
    "一貫性なくない？",
    "その意見、昨日とズレてる。",
  ];

  const heavyReplies = [
    "正直かなり黒寄り。",
    "ここロックして精査したい。",
    "今の発言で吊り位置に上がった。",
    "その動き、人外のそれ。",
    "今日落としてもいいと思ってる。",
    "擁護の仕方が露骨すぎる。",
    "視点漏れっぽい。",
    "もう白は見てない。",
    "村利に見えない。",
    "今一番怪しい位置。",
  ];

  const controlReplies = [
    "今日は情報整理優先で。",
    "決め打つにはまだ早い。",
    "一旦グレー詰めたい。",
    "今日は無理に動かなくていい。",
    "進行的には保留が安定。",
  ];

  const randomChaos = [
    "逆にここ白なら村きつそう。",
    "ここ狼なら強い位置。",
    "噛まれなさそうな発言だね。",
    "最終日まで残りそう。",
    "SGにされそうな動き。",
  ];

  // ===== 疑い値で分岐 =====
  let pool = lightReplies;

  if (user.suspicion > 1.1) {
    pool = heavyReplies;
  } else if (user.suspicion > 0.7) {
    pool = suspiciousReplies;
  }

  // たまに進行・カオス混ぜる
  if (Math.random() < 0.15) pool = controlReplies;
  if (Math.random() < 0.1) pool = randomChaos;

  message.reply(
    pool[Math.floor(Math.random() * pool.length)]
  );
});

// ===== トークン =====
client.login(process.env.TOKEN);
