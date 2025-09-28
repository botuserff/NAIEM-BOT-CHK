module.exports.config = {
  name: "antiout",
  eventType: ["log:unsubscribe"],
  version: "0.0.1",
  credits: "Modified by Mohammad Akash",
  description: "Listen events"
};

module.exports.run = async({ event, api, Threads, Users }) => {
  try {
    let data = (await Threads.getData(event.threadID)).data || {};
    if (data.antiout == false) return;
    if (event.logMessageData.leftParticipantFbId == api.getCurrentUserID()) return;

    const leftId = event.logMessageData.leftParticipantFbId;
    const name = global.data.userName.get(leftId) || await Users.getNameUser(leftId);
    const type = (event.author == leftId) ? "self-separation" : "kicked";

    // যদি ইউজার নিজে ছেড়েছে (self-separation) — তখন আবার এড করার চেষ্টা
    if (type == "self-separation") {
      api.addUserToGroup(leftId, event.threadID, (error, info) => {
        if (error) {
          // যদি প্রাইভেসি বা অন্য কারণে এড না হয় — তোর দেওয়া মেসেজটি পাঠানো হবে
          api.sendMessage(
`আহারে! ${name} ভেবেছিলো পালাইছে 🏃💨
কিন্তু প্রাইভেসি বর্ম লাগানো 🔒 তাই ফিরাইতে পারলাম না।
এইবার বাঁচলি ভাই, কিন্তু চিরদিন না... 😏`,
          event.threadID);
        } else {
          // সফলভাবে এড হলে — তোর দেওয়া মেসেজটি পাঠানো হবে
          api.sendMessage(
`ওই ${name}! পালানোর চেষ্টা করলি? 🤨
এই গ্রুপ হইলো কারাগার 🕸️
এখান থেকে বের হইতে চাইলে জামিন লাগবে – অ্যাডমিনের সাইন সহ! 😎
তুই অনুমতি ছাড়া পালাইছিলি, তাই আবার হাজতে ফেরত দিলাম 🔥`,
          event.threadID);
        }
      });
    }
  } catch (err) {
    console.error("antiout error:", err);
  }
}
