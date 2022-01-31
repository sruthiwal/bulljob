const Queue = require('bull');
const nodemailer = require('nodemailer');
// 1. Initiating the Queue
const sendMailQueue = new Queue('sendMail', {
  redis: {
    host: '127.0.0.1',
    port: 6379
  }
});
const data = {
  email: 'vennala@gmail.com'
};
const options = {
  delay: 60000, // 1 min in ms
  attempts: 2
};
// 2. Adding a Job to the Queue
sendMailQueue.add(data, options);
// 3. Consumer
sendMailQueue.process(async job => { 
    return await sendMail(job.data.email); 
  });
  function sendMail(email) {
    return new Promise((resolve, reject) => {
      let mailOptions = {
        from: 'vennala917@gmail.com',
        to: email,
        subject: 'Bull - npm',
        text: "This email is from bull job",
      };
      let mailConfig = {
        service: 'gmail',
        auth: {
          user: 'vennala917@gmail.com',
          pass: 'Sruthi@123'
        }
      };
      nodemailer.createTransport(mailConfig).sendMail(mailOptions, (err, info) => {
        if (err) {
          reject(err);
        } else {
          resolve(info);
        }
      });
    });
}