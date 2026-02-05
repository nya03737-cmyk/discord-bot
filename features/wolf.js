// features/wolf.js
module.exports = (client) => {

  const userStats = {};
  let globalTurn = 0;

  // ===== ブチ切れワード（含まれたら即発動）=====
  const rageWords = [
    "草","w","www","わろ",
    "雑魚","黙れ","負け",
    "はいはい","もういい",
    "意味ない","どうでもいい",
    "つまらん","知らん","適当"
  ];

  client.once("ready", () => {
    console.log("🐺 WOLF 起動完了");
  });

  client.on("messageCreate", async message => {

    // ===== Bot無視 =====
    if (message.author.bot) return;

    // ===== セットチャンネル制限 =====
    if (
      client.allowedChannelId &&
      message.channel.id !== client.allowedChannelId
    ) return;

    const content = message.content.toLowerCase();
    const userId = message.author.id;

    // ===== 初期化 =====
    if (!userStats[userId]) {
      userStats[userId] = {
        count: 0,
        suspicion: Math.random() * 0.4,
        locked: false,
      };
    }

    // ===== 特定ワードでブチ切れ =====
    if (rageWords.some(w => content.includes(w))) {

      const rageReplies = [
        "は？今の発言なに？",
        "草で逃げるの一番嫌い。",
        "議論する気ないなら黙って。",
        "その一言で一気に黒。",
        "はいはいで済む盤面じゃない。",
        "雑音入れないで。",
        "その態度、人外要素。",
        "今の発言、最悪。",
        "感情吊りされたいの？",
        "思考落とせないの透けてる。",
        "そのワード出る時点で村じゃない。",
      ];

      userStats[userId].suspicion += 0.7;
      userStats[userId].locked = true;

      return message.reply(
        rageReplies[Math.floor(Math.random() * rageReplies.length)]
      );
    }

    // ===== 一文字スパム専用 =====
    if (message.content.length === 1) {
      if (Math.random() < 0.4) {
        const spamReplies = [
          "一文字で何が伝わるの？",
          "発言する気ある？",
          "はいノーカウント。",
          "それで参加してるつもり？",
          "雑すぎ。",
          "色落ちゼロ。",
          "発言稼ぎにもなってない。",
        ];
        return message.reply(
          spamReplies[Math.floor(Math.random() * spamReplies.length)]
        );
      }
      return;
    }

    // ===== 疑い値ランキング =====
    if (message.content === "!ranking") {
      const sorted = Object.entries(userStats)
        .sort((a,b)=>b[1].suspicion-a[1].suspicion)
        .slice(0,5);

      if (!sorted.length) {
        return message.reply("まだ誰も精査対象じゃない。");
      }

      let text = "🏆 疑い値ランキング\n";
      sorted.forEach(([id,d],i)=>{
        const m = message.guild.members.cache.get(id);
        if (m) text += `${i+1}. ${m.user.username}（${d.suspicion.toFixed(2)}）\n`;
      });

      return message.reply(text);
    }

    // ===== 人狼AI本体 =====
    globalTurn++;
    const user = userStats[userId];
    user.count++;
    user.suspicion += 0.04;

    if (!user.locked && Math.random() < 0.06) {
      user.locked = true;
      user.suspicion += 0.3;
    }

    const reactChance = Math.min(
      0.35 + user.suspicion * 0.35 + globalTurn * 0.003,
      0.85
    );
    if (Math.random() > reactChance) return;

    await new Promise(r =>
      setTimeout(r, 700 + Math.random() * 2000)
    );

    // ===== セリフ（増量版）=====
    const light = [
      "今のは普通。",
      "特に違和感なし。",
      "今は触らなくていい。",
      "判断材料として弱い。",
      "一旦保留。",
      "まだ見極め段階。",
      "今のは減点なし。",
      "村っぽくはある。",
      "様子見でいいかな。",
      "情報としては薄い。",
    ];

    const suspicious = [
      "発言数の割に中身ない。",
      "その視点どこから？",
      "話題の出し方が不自然。",
      "発言稼ぎに見える。",
      "無難すぎる。",
      "立ち位置曖昧。",
      "庇い方が雑。",
      "論点ずらしてない？",
      "一貫性なく見える。",
      "色落ちしない発言。",
      "様子見に逃げてる。",
      "ちょっと怪しい。",
    ];

    const heavy = [
      "正直かなり黒い。",
      "ここロック。",
      "吊り候補筆頭。",
      "人外ムーブ。",
      "擁護が露骨。",
      "視点漏れっぽい。",
      "村利に見えない。",
      "もう白見てない。",
      "その言い訳苦しい。",
      "残したくない位置。",
      "今日落としてもいい。",
      "終盤残ると負ける。",
    ];

    const chaos = [
      "ここ狼なら強い。",
      "最終日まで残りそう。",
      "SGにされそう。",
      "噛まれなさそう。",
      "盤面荒らしそう。",
      "終盤で揉める位置。",
    ];

    let pool = light;
    if (user.suspicion > 1.2) pool = heavy;
    else if (user.suspicion > 0.75) pool = suspicious;
    if (Math.random() < 0.15) pool = chaos;

    message.reply(
      pool[Math.floor(Math.random() * pool.length)]
    );
  });
};
