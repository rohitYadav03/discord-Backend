import mailQueue from "../queue/mailQueue.js";
import transporter from "../config/mailConfig.js";

mailQueue.process(async(job) =>  {
      try {
        const emailData = job.data;
       console.log('Processing email', emailData);
  
       const response = await transporter.sendMail(emailData)
return { 
      success: true, 
      messageId: response.messageId || "I dont know",
      sentTo: emailData.to
    };


      } catch (error) {
        console.log(error);
        throw error;
      }
})

/*
EMAIL QUEUE CONSUMER - Background Worker
========================================
1. Transporter = nodemailer setup (gmail/smtp config)
2. Queue = Bull + Redis (stores jobs)
3. Producer adds jobs to queue with email data
4. Consumer (this file) picks up jobs and sends emails
5. job.data contains: {from, to, subject, text}
6. transporter.sendMail() actually sends the email
7. throw error = job failed, Bull will retry
8. return result = job successful, Bull marks complete
*/
