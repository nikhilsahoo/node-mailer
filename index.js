const express = require("express");
const nodemailer = require("nodemailer");
const helmet = require("helmet");
const morgan = require("morgan");
const config = require("config");
const Joi = require("joi");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());

const schema = Joi.object({
  from: Joi.string().email(),
  to: Joi.string().email().required(),
  subject: Joi.string().required(),
  html: Joi.string().required(),
});

if (app.get("env") === "development") {
  console.log("Enabled tiny logging for request");
  app.use(morgan("tiny"));
}
console.log(`mail host is ${config.get("mail.host")}`);
console.log(`mail port is ${config.get("mail.port")}`);
const transporter = nodemailer.createTransport({
  port: config.get("mail.port"),
  host: config.get("mail.host"),
  secure: false,
  tls: {
    rejectUnauthorized: false,
  },
});

const default_mail = {
  from: "test@testmail.com",
  to: "user@testmail.com",
  subject: "test mail",
  text: "Hello World",
  html: "<h2>Hey there</h2>",
};

transporter.verify((error, success) => {
  if (error) console.log(error);
  else console.log("Server is ready to send mails");
});

app.post("/mail", (req, res) => {
  const { error, value } = schema.validate(req.body);
  if (error) {
    res.status(400).send(error);
  }
  const { from, to, subject, html } = req.body;
  default_mail.to = to;
  if (from) {
    default_mail.from = from;
  }
  default_mail.subject = subject;
  default_mail.html = html;

  transporter.sendMail(default_mail, (error, info) => {
    if (error) {
      res.status(500).send(error);
    } else {
      res
        .status(200)
        .send({ message: "mail sent", message_id: info.messageId });
    }
  });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
