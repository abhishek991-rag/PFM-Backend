const sendEmail = async (options) => {
  console.log(`
    --- EMAIL SENT ---
    To: ${options.email}
    Subject: ${options.subject}
    Message: ${options.message}
    ------------------
    `);
};

module.exports = sendEmail;
