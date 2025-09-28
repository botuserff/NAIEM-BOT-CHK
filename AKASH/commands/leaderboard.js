const fs = require("fs");
const path = __dirname + "/coinxbalance.json";

// ফাইল না থাকলে বানানো
if (!fs.existsSync(path)) {
    fs.writeFileSync(path, JSON.stringify({}, null, 2));
}

module.exports.config = {
    name: "leaderboard",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Akash × ChatGPT",
    description: "Show balance leaderboard",
    commandCategory: "Economy",
    usages: "/leaderboard",
    cooldowns: 5
};

// বড় সংখ্যা ফরম্যাট
function formatBalance(num) {
    if (num >= 1e12) return (num / 1e12).toFixed(2) + "T";
    if (num >= 1e9) return (num / 1e9).toFixed(2) + "B";
    if (num >= 1e6) return (num / 1e6).toFixed(2) + "M";
    if (num >= 1e3) return (num / 1e3).toFixed(2) + "K";
    return num;
}

module.exports.run = async function({ api, event, Users }) {
    const { threadID } = event;

    try {
        const data = JSON.parse(fs.readFileSync(path));
        if (!data || Object.keys(data).length === 0)
            return api.sendMessage("❌ কোনো ব্যালেন্স ডেটা নেই!", threadID);

        // sort by balance descending
        let sorted = Object.entries(data).sort((a, b) => b[1].balance - a[1].balance);

        // শুধু Top 10 দেখাবে
        let message = "🏆 𝗟𝗲𝗮𝗱𝗲𝗿𝗯𝗼𝗮𝗿𝗱 🏆\n\n";

        for (let i = 0; i < Math.min(sorted.length, 10); i++) {
            let [uid, info] = sorted[i];
            let name = await Users.getNameUser(uid);
            message += `${i + 1}. ${name} — ${formatBalance(info.balance)} 💰\n`;
        }

        api.sendMessage(message, threadID);
    } catch (err) {
        console.error(err);
        api.sendMessage("❌ লিডারবোর্ড তৈরি করতে সমস্যা হয়েছে!", threadID);
    }
};
