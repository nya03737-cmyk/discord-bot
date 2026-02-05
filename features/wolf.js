module.exports = (client) => {

  const userStats = {};
  let globalTurn = 0;

  // ===== ブチ切れワード =====
  const RAGE_WORDS = [
    "草", "w", "www", "適当", "知らん", "どうでもいい",
    "眠い", "だるい", "任せる", "スキップ", "無言",
    "は？", "意味わからん", "興味ない"
  ];

  client.on("messageCreate", async (message) => {

    // ===== Bot無視 =====
    if (message.author.bot) return;

    // ===== セットチャンネル以外完全無視 =====
    if (!client.allowedChannelId) return;
    if (message.channel.id !== client.allowedChannelId) return;

    const content = message.content;

    // ===== 疑い値ランキング（最優先・唯一のコマンド）=====
    if (content === "!ranking") {
      const entries = Object.entries(userStats);

      if (entries.length === 0) {
        return message.reply("まだ誰も疑われてないとか、平和すぎて逆に不安。");
      }

      const sorted = entries
        .sort((a, b) => b[1].suspicion - a[1].suspicion)
        .slice(0, 5);

      let text = "🏆 **疑い値ランキング TOP5**\n";
      sorted.forEach(([id, data], i) => {
        const member = message.guild.members.cache.get(id);
        if (!member) return;
        text += `${i + 1}. ${member.user.username}（${data.suspicion.toFixed(2)}）\n`;
      });

      return message.reply(text);
    }

    // ===== その他コマンドは完全無視 =====
    if (content.startsWith("!")) return;

    // ===== ブチ切れ（確率無視）=====
    if (RAGE_WORDS.some(w => content.includes(w))) {
      return message.reply(
        "……は？その一言で盤面進むと思ってるなら相当ヤバいけど。"
      );
    }

    // ===== 人狼AI本体 =====
    globalTurn++;
    const userId = message.author.id;

    if (!userStats[userId]) {
      userStats[userId] = {
        count: 0,
        suspicion: Math.random() * 0.6,
        locked: false,
      };
    }

    const user = userStats[userId];
    user.count++;
    user.suspicion += 0.05;

    if (!user.locked && Math.random() < 0.1) {
      user.locked = true;
      user.suspicion += 0.5;
    }

    // ===== 反応確率 =====
    const reactChance = Math.min(
      0.3 + user.suspicion * 0.35 + globalTurn * 0.001,
      0.85
    );

    if (Math.random() > reactChance) return;

    await new Promise(r => setTimeout(r, 700 + Math.random() * 2000));

    // ===== セリフ群 =====
    const light = [
      "その発言自体は別に問題ない。",
      "今のところは様子見。",
      "判断材料としては弱いかな。",
      "今触る位置ではない。",
      "発言は普通、以上。",
      "一応メモしておく。",
      "今はフラット。",
      "まだ色つかない。",
      "どっちとも取れる。",
      "今のは流していい。",
      "今後の発言次第。",
      "今は保留。",
      "現状白黒つける要素じゃない。",
    ];

    const suspicious = [
      "発言数の割に中身なくない？",
      "その視点、どこから出た？",
      "今その話題出す意味ある？",
      "ちょっと動き早すぎ。",
      "発言稼ぎにしか見えない。",
      "視点が浮いてる。",
      "庇い方が雑。",
      "一貫性がない。",
      "村の思考には見えない。",
      "無難すぎて逆に怪しい。",
      "責任負わない発言多くない？",
      "考察してる風に見えるだけ。",
      "安全圏から石投げてる感じ。",
      "発言の割に覚悟ないよね。",
    ];

    const heavy = [
      "正直かなり黒い。",
      "ここロックする。",
      "今の発言で吊り候補。",
      "その動き完全に人外。",
      "村利に見えない。",
      "もう白は見てない。",
      "視点漏れしてる。",
      "残す位置じゃない。",
      "今一番怪しい。",
      "今日落ちても文句言えない。",
      "狼の動きそのもの。",
      "これで白主張は無理ある。",
      "擁護する要素がない。",
      "ここ最終日来たら負ける。",
      "今処理しない理由がない。",
    ];

    const chaos = [
      "ここ最終日まで残りそうで怖い。",
      "逆にここ白なら村相当きつい。",
      "SGにされる動きしてる。",
      "噛まれなさそう。",
      "狼なら相当うまい位置。",
      "終盤まで残るタイプ。",
      "ミスリード要員感ある。",
      "残すと面倒な位置。",
    ];

    let pool = light;
    if (user.suspicion > 1.3) pool = heavy;
    else if (user.suspicion > 0.8) pool = suspicious;
    if (Math.random() < 0.2) pool = chaos;

    message.reply(pool[Math.floor(Math.random() * pool.length)]);
  });
};
