//# Mailjet
const mailjet = require("node-mailjet");

const transporter = mailjet.connect(
  "56e6d8af4c3d2582ba04257df3cb40e0",
  "ae8cb20473ea66302bc767d7aa650e86"
);

module.exports = function sendMail(name, email, title, html, callback) {
  const request = transporter.post("send", { version: "v3.1" }).request({
    Messages: [
      {
        From: {
          Email: "harsh.nishant.superstar@gmail.com",
          Name: "Kumar Harsh",
        },
        To: [
          {
            Email: email,
            Name: name,
          },
        ],
        Subject: title,
        TextPart: "E-Commerce Verification Mail",
        HTMLPart: html,
        CustomID: "AppGettingStartedTest",
      },
    ],
  });
  request
    .then((result) => {
      callback(result, null);
    })
    .catch((err) => {
      console.log(err);
      callback(null, err);
    });
};
