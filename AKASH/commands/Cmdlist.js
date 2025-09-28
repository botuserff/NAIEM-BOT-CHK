module.exports.config = {
  name: "cmdlist",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "Akash",
  description: "Show bot commands with first page example and reply page support",
  commandCategory: "system",
  usages: "/cmdlist",
  cooldowns: 5,
};

module.exports.run = async function({ api, event, client }) {
  const prefix = "/";
  const botOwner = "Mohammad Akash";
  const supportLink = "https://m.me/arakashiam";
  const poweredBy = "Akash";

  // উদাহরণ কমান্ড – ১ম পেজের জন্য
  const firstPageCommands = [
    "balance",
    "Send Money",
    "Bet",
    "Quiz",
    "Love",
    "Pair",
    "Needgf",
    "Bestu",
    "Crush",
    "Age"
  ];

  // বটের সব কমান্ড
  const allCommands = [];
  for (const key of client.commands.keys()) {
    allCommands.push(client.commands.get(key).config.name);
  }

  const perPage = 10; // প্রতি পাতায় কমান্ড সংখ্যা
  const totalPage = Math.ceil(allCommands.length / perPage);

  // ফাংশন – নির্দিষ্ট পেজের মেসেজ বানানো
  const showPage = (page) => {
    let commandsToShow;

    if (page === 1) {
      commandsToShow = firstPageCommands;
    } else {
      let start = (page - 2) * perPage; // ২য় পেজ থেকে আসল কমান্ড
      let end = start + perPage;
      commandsToShow = allCommands.slice(start, end);
    }

    let list = commandsToShow.map(cmd => `⚡ ${cmd}`).join("\n");

    return `
╔════════════════════╗
     📜  Command List  
╚════════════════════╝

👤 Bot Owner: ${botOwner}
📖 Total Commands: ${allCommands.length}
🔖 Page: ${page}/${totalPage}
🔑 Prefix: ${prefix}

───────────────────────
${list}
───────────────────────

🌐 Support: ${supportLink}
💠 Powered By ${poweredBy}
`;
  };

  // প্রথমে Page 1 পাঠানো
  api.sendMessage(showPage(1), event.threadID, (err, info) => {
    if (err) return;
    // রিপ্লাই হ্যান্ডল করার জন্য
    if (!global.client.handleReply) global.client.handleReply = [];
    global.client.handleReply.push({
      name: module.exports.config.name,
      messageID: info.messageID,
      author: event.senderID,
      type: "page",
      perPage,
      firstPageCommands,
      allCommands,
      totalPage
    });
  }, event.messageID);
};

// রিপ্লাই হ্যান্ডলার
module.exports.handleReply = async function({ api, event, handleReply }) {
  if (handleReply.author != event.senderID) return;

  if (handleReply.type === "page") {
    let page = parseInt(event.body);
    if (isNaN(page) || page < 1) return api.sendMessage("⚠️ শুধু সঠিক পেজ নাম্বার লিখুন!", event.threadID, event.messageID);

    const { perPage, firstPageCommands, allCommands, totalPage } = handleReply;
    let commandsToShow;

    if (page === 1) {
      commandsToShow = firstPageCommands;
    } else {
      let start = (page - 2) * perPage;
      let end = start + perPage;
      commandsToShow = allCommands.slice(start, end);
    }

    let list = commandsToShow.map(cmd => `⚡ ${cmd}`).join("\n");

    let msg = `
╔════════════════════╗
     📜  Command List  
╚════════════════════╝

👤 Bot Owner: Mohammad Akash
📖 Total Commands: ${allCommands.length}
🔖 Page: ${page}/${totalPage}
🔑 Prefix: /

───────────────────────
${list}
───────────────────────

🌐 Support: https://m.me/arakashiam
💠 Powered By Akash
`;

    api.sendMessage(msg, event.threadID, event.messageID);
  }
};
