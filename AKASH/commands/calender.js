// File name: calender.js

module.exports.config = {
    name: "calender",
    version: "5.0.0",
    permission: 0,
    credits: "Akash Edit",
    description: "Feature-rich Calendar with Time, Hijri, Week, Season",
    commandCategory: "utility",
    usages: "/calender",
    cooldowns: 3,
};

module.exports.run = async function({ api, event }) {
    const moment = require("moment-timezone");

    // টাইমজোন
    let now = moment().tz("Asia/Dhaka");

    // 12h & 24h time
    let time12 = now.format("hh:mm:ss A");
    let time24 = now.format("HH:mm:ss");

    // Date & Day
    let date = now.format("DD-MM-YYYY");
    let day = now.format("dddd");
    let fullDate = now.format("Do MMMM YYYY, dddd");

    // Hijri Date (English) - static example
    let hijriDate = "27th Rabi’ul-Awwal 1447";

    // Week number
    let weekNum = now.format("W");

    // Season / Quarter
    let monthNum = now.month() + 1;
    let season = "";
    if ([12,1,2].includes(monthNum)) season = "Winter ❄️";
    else if ([3,4,5].includes(monthNum)) season = "Spring 🌸";
    else if ([6,7,8].includes(monthNum)) season = "Summer ☀️";
    else if ([9,10,11].includes(monthNum)) season = "Autumn 🍂";
    let quarter = Math.ceil(monthNum/3);

    // Message
    let msg = `
📅 Calendar

⏰ Time: ${time12} (12h) | ${time24} (24h)
📆 Date: ${date}
🗓️ Day: ${day}
📖 Details: ${fullDate}
🕌 Hijri Date: ${hijriDate}
📊 Week: ${weekNum}
🍃 Season: ${season} | Quarter: Q${quarter}
🕰️ Timezone: Asia/Dhaka
`;

    return api.sendMessage(msg, event.threadID, event.messageID);
};
