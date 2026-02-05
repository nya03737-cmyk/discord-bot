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

    // ===== ③ 一文字・スパム専用リアクション =====
    if (message.content.length <= 1) {
      if (Math.random() < 0.35) {
        const spamReplies = [
          "それ発言って呼んでいい？",
          "一文字で逃げるのやめよ。",
          "はいはい、ノーカウント。",
          "それで色落ちすると思ってる？",
          "喋る気ないなら黙ってて。",
          "議論する気ある？",
          "その一文字に何の意味が？",
          "雑音入れないで。",
          "村利にならない発言。",
          "発言稼ぎ雑すぎ。",
        ];
        return message.reply(
          spamReplies[Math.floor(Math.random() * spamReplies.length)]
        );
      }
      return;
    }

    // ===== 疑い値ランキング =====
    if (message.content === "!ranking") {
      const entries = Object.entries(userStats);

      if (entries.length === 0) {
        return message.reply("まだ疑い値データがありません。");
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
          + `（疑い値: ${data.suspicion.toFixed(2)} / 発言: ${data.count}）\n`;
      }

      return message.reply(text);
    }

    // ===== 人狼AI 本体 =====
    globalTurn++;
    const userId = message.author.id;

    if (!userStats[userId]) {
      userStats[userId] = {
        count: 0,
        suspicion: Math.random() * 0.5,
        locked: false,
      };
    }

    const user = userStats[userId];
    user.count++;
    user.suspicion += 0.05;

    if (!user.locked && Math.random() < 0.06) {
      user.locked = true;
      user.suspicion += 0.35;
    }

    // ===== 反応率（かなり高め）=====
    const reactChance = Math.min(
      0.35 + user.suspicion * 0.35 + globalTurn * 0.003,
      0.85
    );
    if (Math.random() > reactChance) return;

    await new Promise(r =>
      setTimeout(r, 800 + Math.random() * 2000)
    );

    // ===== セリフ群 =====

    const lightReplies = [
      "その発言自体は普通。",
      "今のところは白寄り。",
      "判断材料としては弱い。",
      "まだ触る位置じゃない。",
      "今はフラットで見てる。",
      "特に違和感なし。",
      "今の発言は減点なし。",
      "様子見でいいかな。",
      "可もなく不可もなく。",
      "今のは村っぽい動き。",
    ];

    const suspiciousReplies = [
      "発言数の割に中身薄くない？",
      "その視点どこから来た？",
      "話題の出し方が不自然。",
      "ちょっと発言稼ぎ臭い。",
      "今そこ触る意味ある？",
      "論点ずらしてない？",
      "その庇い方怪しい。",
      "立ち位置が曖昧すぎる。",
      "一貫性なく見える。",
      "様子見に逃げてる印象。",
      "無難すぎて逆に怪しい。",
      "その発言、色落ちしない。",
    ];

    const heavyReplies = [
      "正直かなり黒寄り。",
      "もうロックして見てる。",
      "吊り候補に上げたい。",
      "その動き人外っぽい。",
      "擁護が露骨すぎ。",
      "視点漏れしてない？",
      "村利に全く見えない。",
      "今日落としてもいい。",
      "その言い訳苦しくない？",
      "もう白要素拾えない。",
      "黒塗りじゃなく事実指摘。",
      "その発言で印象かなり落ちた。",
    ];

    const controlReplies = [
      "今日は情報整理優先。",
      "決め打つにはまだ早い。",
      "無理に動く場面じゃない。",
      "一旦グレー詰めたい。",
      "今日は保留が安定。",
      "盤面見直そう。",
      "焦って吊る必要ない。",
    ];

    const randomChaos = [
      "逆にここ白なら村きつい。",
      "ここ狼なら相当強い位置。",
      "最終日まで残りそう。",
      "SGにされやすそう。",
      "噛まれなさそうな発言。",
      "この人残されそうだな。",
      "終盤で揉めそう。",
    ];

    let pool = lightReplies;
    if (user.suspicion > 1.2) pool = heavyReplies;
    else if (user.suspicion > 0.75) pool = suspiciousReplies;

    if (Math.random() < 0.2) pool = controlReplies;
    if (Math.random() < 0.12) pool = randomChaos;

    message.reply(
      pool[Math.floor(Math.random() * pool.length)]
    );
  });
};
