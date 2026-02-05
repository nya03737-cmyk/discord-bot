// features/wolf.js
module.exports = (client) => {

  // ===== 人狼AI 状態管理 =====
  const userStats = {};
  let globalTurn = 0;

  client.once("ready", () => {
    console.log("🐺 人狼ジャッジメント風Bot 起動！");
  });

  client.on("messageCreate", async message => {

    // ===== ① Bot無視 =====
    if (message.author.bot) return;

    // ===== ② セットチャンネル制限 =====
    if (
      client.allowedChannelId &&
      message.channel.id !== client.allowedChannelId
    ) {
      return;
    }

    // ===== ③ ランキングコマンド（最優先） =====
    if (message.content === "!ranking") {
      const entries = Object.entries(userStats);

      if (entries.length === 0) {
        return message.reply("まだ誰も精査対象にすらなってないけど？");
      }

      const sorted = entries
        .sort((a, b) => b[1].suspicion - a[1].suspicion)
        .slice(0, 5);

      let text = "🏆 **疑い値ランキング TOP5**\n";

      for (let i = 0; i < sorted.length; i++) {
        const [userId, data] = sorted[i];
        const member = message.guild.members.cache.get(userId);
        if (!member) continue;

        text += `${i + 1}. ${member.user.username} `
          + `（疑い値: ${data.suspicion.toFixed(2)} / 発言数: ${data.count}）\n`;
      }

      return message.reply(text);
    }

    // ===== ④ 発言フィルター（緩め） =====
    // ・短文もOK
    // ・スタンプ/意味不明1文字は無視
    if (message.content.length <= 1) return;

    // ===== 人狼AI 本体 =====
    globalTurn++;
    const userId = message.author.id;

    if (!userStats[userId]) {
      userStats[userId] = {
        count: 0,
        suspicion: Math.random() * 0.4,
        locked: false,
      };
    }

    const user = userStats[userId];
    user.count++;
    user.suspicion += 0.04;

    // ロックオン
    if (!user.locked && Math.random() < 0.06) {
      user.locked = true;
      user.suspicion += 0.35;
    }

    // ===== 反応確率 =====
    const reactChance = Math.min(
      0.2 + user.suspicion * 0.3 + globalTurn * 0.002,
      0.75
    );

    if (Math.random() > reactChance) return;

    // 人間っぽい遅延
    await new Promise(r =>
      setTimeout(r, 800 + Math.random() * 2200)
    );

    // ===== セリフ群（煽り強化） =====

    const lightReplies = [
      "今の発言、特に要素ないね。",
      "ふーん、それで？",
      "まあ今は触らなくていいか。",
      "その発言、別に色つかない。",
      "様子見ムーブって感じ。",
      "無難すぎて逆に何も見えない。",
      "今は放置枠かな。",
      "情報ゼロではないけど薄い。",
    ];

    const suspiciousReplies = [
      "発言数の割に中身なさすぎ。",
      "今それ言う意味、説明できる？",
      "その視点どっから湧いた？",
      "発言稼ぎにしか見えない。",
      "ちょっと動き不自然じゃない？",
      "周り見てから喋ってる感ある。",
      "その庇い方、雑すぎ。",
      "論点ずらしてない？",
      "今の発言、村利ではない。",
      "一貫性がどっか行った。",
    ];

    const heavyReplies = [
      "はい黒い。",
      "もう白では見てない。",
      "ここロックするわ。",
      "今日の吊り候補筆頭。",
      "人外ムーブそのもの。",
      "擁護が露骨すぎて逆効果。",
      "視点漏れにしか見えん。",
      "その動き、村ならやらん。",
      "残したくない位置。",
      "ここ最終日残ると負ける。",
      "正直、かなり人外寄り。",
      "これで白取るのは無理。",
    ];

    const controlReplies = [
      "進行的には今触る場所じゃない。",
      "今日は情報整理優先で。",
      "無理に決め打つ盤面じゃない。",
      "今日はグレー詰めでいい。",
      "まだ決断する時間じゃない。",
    ];

    const randomChaos = [
      "ここ狼なら相当やっかい。",
      "逆に白ならSG位置だね。",
      "噛まれなさそうな発言だな。",
      "最終日まで生き残りそう。",
      "殴られ役になりそう。",
      "ここ放置すると荒れる。",
    ];

    // ===== 疑い値で分岐 =====
    let pool = lightReplies;

    if (user.suspicion > 1.2) {
      pool = heavyReplies;
    } else if (user.suspicion > 0.75) {
      pool = suspiciousReplies;
    }

    // 進行・カオス混入
    if (Math.random() < 0.12) pool = controlReplies;
    if (Math.random() < 0.12) pool = randomChaos;

    message.reply(
      pool[Math.floor(Math.random() * pool.length)]
    );
  });
};
