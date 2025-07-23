import mailQueue from "../queue/mailQueue.js";

export const addEmailToMailQueue = async(emailData) => {
try {
   await mailQueue.add(emailData)
   console.log(`emial added to queue`);
   
} catch (error) {
    console.log(`error in add mail queue ${error}`);
}
}

