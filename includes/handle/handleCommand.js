module.exports = function ({ api, models, Users, Threads, Currencies }) {
  const stringSimilarity = require("string-similarity");
  const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const logger = require("../../utils/log.js");
  const moment = require("moment-timezone");
  const axios = require("axios");

  return async function ({ event }) {
    const dateNow = Date.now();
    const time = moment.tz("Asia/Dhaka").format("HH:mm:ss DD/MM/YYYY");

    const {
      allowInbox,
      PREFIX,
      ADMINBOT,
      NDH,
      DeveloperMode,
    } = global.config;

    const {
      userBanned,
      threadBanned,
      threadInfo,
      threadData,
      commandBanned,
    } = global.data;

    const { commands, cooldowns } = global.client;

    let { body, senderID, threadID, messageID } = event;
    if (!body) return;

    senderID = String(senderID);
    threadID = String(threadID);

    // Thread prefix
    const threadSetting = threadData.get(threadID) || {};
    const prefix =
      threadSetting.hasOwnProperty("PREFIX") &&
      threadSetting.PREFIX != null
        ? threadSetting.PREFIX
        : PREFIX;

    const prefixRegex = new RegExp(`^(${escapeRegex(prefix)})\\s*`);
    if (!prefixRegex.test(body)) return;

    // === ADMIN/NDH MODE SYSTEM ===
    const adminbot = require("./../../config.json");

    // Inbox admin only (adminPaOnly)
    if (!global.data.allThreadID.includes(threadID) &&
      !ADMINBOT.includes(senderID) &&
      adminbot.adminPaOnly === true
    ) {
      return api.sendMessage(
        "MODE » Only admins can use bots in their own inbox",
        threadID,
        messageID
      );
    }

    // adminOnly
    if (!ADMINBOT.includes(senderID) && adminbot.adminOnly === true) {
      return api.sendMessage(
        "MODE » Only admins can use bots",
        threadID,
        messageID
      );
    }

    // ndhOnly
    if (!NDH.includes(senderID) &&
      !ADMINBOT.includes(senderID) &&
      adminbot.ndhOnly === true
    ) {
      return api.sendMessage(
        "MODE » Only bot support can use bots",
        threadID,
        messageID
      );
    }

    // adminbox system
    const dataAdbox = require("../../AKASH/commands/cache/data.json");
    var threadInf = (threadInfo.get(threadID) || await Threads.getInfo(threadID));
    const findd = threadInf.adminIDs.find(el => el.id == senderID);
    if (
      dataAdbox.adminbox.hasOwnProperty(threadID) &&
      dataAdbox.adminbox[threadID] == true &&
      !ADMINBOT.includes(senderID) &&
      !findd &&
      event.isGroup == true
    ) {
      return api.sendMessage("MODE » Only admins can use bots", threadID, messageID);
    }

    // Ban check (user/thread)
    if (userBanned.has(senderID) || threadBanned.has(threadID) || (allowInbox == false && senderID == threadID)) {
      if (!ADMINBOT.includes(senderID)) {
        if (userBanned.has(senderID)) {
          const { reason, dateAdded } = userBanned.get(senderID) || {};
          return api.sendMessage(
            `🚫 You are banned!\nReason: ${reason || "N/A"}\nDate: ${dateAdded || "N/A"}`,
            threadID,
            async (err, info) => {
              await new Promise(resolve => setTimeout(resolve, 5000));
              return api.unsendMessage(info.messageID);
            },
            messageID
          );
        } else if (threadBanned.has(threadID)) {
          const { reason, dateAdded } = threadBanned.get(threadID) || {};
          return api.sendMessage(
            `🚫 This thread is banned!\nReason: ${reason || "N/A"}\nDate: ${dateAdded || "N/A"}`,
            threadID,
            async (err, info) => {
              await new Promise(resolve => setTimeout(resolve, 5000));
              return api.unsendMessage(info.messageID);
            },
            messageID
          );
        }
      }
    }

    // === PREFIX + ARGS ===
    const [matchedPrefix] = body.match(prefixRegex);
    const args = body.slice(matchedPrefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    // === Command খোঁজা ===
    let command = commands.get(commandName);
    if (!command) {
      const allCommandName = Array.from(commands.keys());
      const checker = stringSimilarity.findBestMatch(commandName, allCommandName);
      if (checker.bestMatch.rating >= 0.5) {
        command = commands.get(checker.bestMatch.target);
      } else {
        return api.sendMessage(
          `দূঃখিত আপনি ভুল কমান্ড ব্যবহার করছেনWallpaper ?

অন্য কমান্ড ব্যবহার করুন  🕊️: ${commandName}`,
          threadID,
          messageID
        );
      }
    }

    // === Command banned check ===
    if (commandBanned.get(threadID) || commandBanned.get(senderID)) {
      if (!ADMINBOT.includes(senderID)) {
        const banThreads = commandBanned.get(threadID) || [];
        const banUsers = commandBanned.get(senderID) || [];
        if (banThreads.includes(command.config.name)) {
          return api.sendMessage(
            `🚫 This command is banned in this thread: ${command.config.name}`,
            threadID,
            async (err, info) => {
              await new Promise(resolve => setTimeout(resolve, 5000));
              return api.unsendMessage(info.messageID);
            },
            messageID
          );
        }
        if (banUsers.includes(command.config.name)) {
          return api.sendMessage(
            `🚫 You are banned from using: ${command.config.name}`,
            threadID,
            async (err, info) => {
              await new Promise(resolve => setTimeout(resolve, 5000));
              return api.unsendMessage(info.messageID);
            },
            messageID
          );
        }
      }
    }

    // === NSFW Allow check ===
    if (
      command.config.commandCategory?.toLowerCase() == "nsfw" &&
      !global.data.threadAllowNSFW.includes(threadID) &&
      !ADMINBOT.includes(senderID)
    ) {
      return api.sendMessage(
        "🚫 This thread is not allowed to use NSFW commands!",
        threadID,
        async (err, info) => {
          await new Promise(resolve => setTimeout(resolve, 5000));
          return api.unsendMessage(info.messageID);
        },
        messageID
      );
    }

    // === Permission check ===
    let permssion = 0;
    const info = threadInfo.get(threadID) || (await Threads.getInfo(threadID));
    const isGroupAdmin = info?.adminIDs?.some((el) => el.id == senderID);

    if (NDH.includes(senderID)) permssion = 2;
    if (ADMINBOT.includes(senderID)) permssion = 3;
    else if (isGroupAdmin) permssion = 1;

    if (command.config.hasPermssion > permssion) {
      return api.sendMessage(
        `এই কমান্ডটা তোর জন্য না!\n👑 এইটা শুধুমাত্র আমার বস আকাশ  ব্যবহার করতে পারবে!\nতুই এডমিন লেভেলে নাই বুঝলি? 😂 "${command.config.name}"`,
        threadID,
        messageID
      );
    }

    // === Cooldown check ===
    if (!cooldowns.has(command.config.name)) {
      cooldowns.set(command.config.name, new Map());
    }
    const timestamps = cooldowns.get(command.config.name);
    const expirationTime = (command.config.cooldowns || 1) * 1000;

    if (
      timestamps.has(senderID) &&
      dateNow < timestamps.get(senderID) + expirationTime
    ) {
      const timeLeft = (timestamps.get(senderID) + expirationTime - dateNow) / 1000;
      return api.sendMessage(
        `⏳ Please wait ${timeLeft.toFixed(1)}s before using "${command.config.name}" again.`,
        threadID,
        messageID
      );
    }

    // === Command Run ===
    try {
      await command.run({
        api,
        event,
        args,
        models,
        Users,
        Threads,
        Currencies,
        permssion,
      });

      timestamps.set(senderID, dateNow);

      if (DeveloperMode) {
        logger(
          `[CMD] ${time} | ${commandName} | UID: ${senderID} | TID: ${threadID}`
        );
      }
    } catch (err) {
      console.error(err);
      return api.sendMessage(
        `⚠️ Error in "${commandName}": ${err.message}`,
        threadID,
        messageID
      );
    }
  };
};