module.exports.config = {
    name: "autofriend",
    version: "1.0.0",
    credits: "AR Akash",
    description: "নতুন ফ্রেন্ড রিকুয়েস্ট আসলেই অটো এক্সেপ্ট করবে",
    eventType: ["log:subscribe"],
    hasPermssion: 0
};

module.exports.run = async function({ api, event }) {
    try {
        // নতুন ফ্রেন্ড রিকুয়েস্ট আসলে ID নিয়ে এক্সেপ্ট করা
        if(event.type === "log:subscribe" && event.logMessageData.addedParticipants) {
            for(const participant of event.logMessageData.addedParticipants) {
                // যদি বট নিজেই না হয়
                if(participant.userFbId !== api.getCurrentUserID()) {
                    api.approveFriendRequest(participant.userFbId, (err) => {
                        if(err) console.log(err);
                        else console.log(`✅ Accepted friend request from ID: ${participant.userFbId}`);
                    });
                }
            }
        }
    } catch (error) {
        console.error("Friend request auto-accept error:", error);
    }
};
