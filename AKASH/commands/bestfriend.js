const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const jimp = require("jimp");

module.exports.config = {
 name: "bestfriend",
 version: "7.3.1",
 hasPermssion: 0,
 credits: "𝐀𝐋𝐕𝐈", // don't change my Credit Coz i Edit
 description: "Get Pair From Mention",
 commandCategory: "img",
 usages: "[@mention]",
 cooldowns: 5,
 dependencies: {
 axios: "",
 "fs-extra": "",
 path: "",
 jimp: ""
 }
};

module.exports.onLoad = async () => {
 const dir = path.join(__dirname, "cache", "canvas");
 const imgPath = path.join(dir, "arr6.png");

 if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
 if (!fs.existsSync(imgPath)) {
 const { data } = await axios.get("https://i.imgur.com/FGdorom.jpg", { responseType: "arraybuffer" });
 fs.writeFileSync(imgPath, data);
 }
};

async function circle(image) {
 image = await jimp.read(image);
 image.circle();
 return await image.getBufferAsync("image/png");
}

async function makeImage({ one, two }) {
 const __root = path.join(__dirname, "cache", "canvas");
 const baseImg = await jimp.read(path.join(__root, "arr6.png"));

 const avatarOnePath = path.join(__root, `avt_${one}.png`);
 const avatarTwoPath = path.join(__root, `avt_${two}.png`);
 const outputPath = path.join(__root, `bestfriend_${one}_${two}.png`);

 const avatarOneBuffer = (await axios.get(`https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' })).data;
 fs.writeFileSync(avatarOnePath, Buffer.from(avatarOneBuffer, 'utf-8'));

 const avatarTwoBuffer = (await axios.get(`https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' })).data;
 fs.writeFileSync(avatarTwoPath, Buffer.from(avatarTwoBuffer, 'utf-8'));

 const circleOne = await jimp.read(await circle(avatarOnePath));
 const circleTwo = await jimp.read(await circle(avatarTwoPath));

 baseImg.composite(circleOne.resize(210, 200), 80, 110);
 baseImg.composite(circleTwo.resize(222, 200), 416, 116);

 const raw = await baseImg.getBufferAsync("image/png");
 fs.writeFileSync(outputPath, raw);

 fs.unlinkSync(avatarOnePath);
 fs.unlinkSync(avatarTwoPath);

 return outputPath;
}

module.exports.run = async function ({ event, api, args }) {
 const { threadID, messageID, senderID, mentions } = event;
 const mention = Object.keys(mentions);

 if (mention.length === 0) {
 return api.sendMessage("কিরে বদল 😒 তোর বেষ্ট ফ্রেন্ড কে মেনশন কর আগে ⭕", threadID, messageID);
 }

 const one = senderID;
 const two = mention[0];

 try {
 const imagePath = await makeImage({ one, two });
 return api.sendMessage({
 body: "🌸💚~সম্পর্কের”নাম”যাই হোক” না কেন–💙🌼\n🖤🥀মন খারাপের সময় যে পাশে থাকে🌺🌼\n🌺💞সেই প্রিয় বেষ্ট ফ্রেন্ড❥━➸➽❥🖤🪽",
 attachment: fs.createReadStream(imagePath)
 }, threadID, () => fs.unlinkSync(imagePath), messageID);
 } catch (err) {
 console.error(err);
 return api.sendMessage("😔 দুঃখিত! বেষ্ট ফ্রেন্ড ফটো বানাতে সমস্যা হয়েছে!", threadID, messageID);
 }
};