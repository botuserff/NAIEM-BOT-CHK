module.exports.config = {
    name: "joinNoti",
    eventType: ["log:subscribe"],
    version: "1.0.4",
    credits: "CYBER BOT TEAM",
    description: "Welcome message for new members or bot (text only)"
};

module.exports.run = async function({ api, event }) {
    const { threadID } = event;

    try {
        let { threadName, participantIDs } = await api.getThreadInfo(threadID);

        // Added By এর নাম পেতে
        let authorName = "Unknown";
        if (event.author) {
            const userInfo = await api.getUserInfo(event.author);
            authorName = userInfo[event.author].name || "Unknown";
        }

        for (let newMember of event.logMessageData.addedParticipants) {
            const name = newMember.fullName;

            // ✅ যদি বটকে অ্যাড করা হয়
            if (newMember.userFbId == api.getCurrentUserID()) {
                let botMsg = 
`🌸 আসসালামু আলাইকুম 🌸

ধন্যবাদ আমাকে গ্রুপে এড করার জন্য 🤍  
ইনশাআল্লাহ আমি সবসময় সার্ভিসে থাকবো 💫

𝙲𝚘𝚖𝚖𝚊𝚗𝚍 দেখতে ➤ /help  
𝙱𝚘𝚃 𝙾𝚠𝚗𝚎𝚛 : 𝙼𝚘𝚑𝚊𝚖𝚖𝚊𝚍 𝙰𝚔𝚊𝚜𝚑`;

                return api.sendMessage(botMsg, threadID);
            }

            // ✅ যদি সাধারণ মেম্বার অ্যাড হয়
            let userMsg = 
`__আসসালামু আলাইকুম__
═══════════════
__𝚆𝚎𝚕𝚌𝚘𝚖𝚎 ➤ ${name}__

_আমাদের ${threadName}_
_এর পক্ষ থেকে আপনাকে_
       __!! স্বাগতম !!__

__আপনি এই__
        __গ্রুপের ${participantIDs.length}__
___নাম্বার মেম্বার___!!

___𝙰𝚍𝚍𝚎𝚍 𝙱𝚢 : ${authorName}___

𝙱𝚘𝚝 𝙾𝚠𝚗𝚎𝚛 : 𝙼𝚘𝚑𝚊𝚖𝚖𝚊𝚍 𝙰𝚔𝚊𝚜𝚑`;

            api.sendMessage(userMsg, threadID);
        }
    } catch (e) {
        console.log(e);
    }
};
