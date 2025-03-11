const express = require("express");
const axios = require("axios");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();
app.use(express.json());

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

app.post("/auth/callback", async (req, res) => {
  const { token } = req.body;

  try {
    const userInfo = await axios.get(
      `https://https://dev-0dqmv26n0q05xpcp.us.auth0.com/userinfo`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userInfo.data.email,
      subject: "Your Auth Token",
      text: `Here is your authentication token: ${token}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        res.status(500).send("Error sending email");
      } else {
        console.log("Email sent:", info.response);
        res.status(200).send("Email sent successfully");
      }
    });
  } catch (err) {
    console.error("Error validating token:", err);
    res.status(500).send("Error validating token");
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
