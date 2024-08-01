const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const stripe = require("stripe")(process.env.STRIPE_KEY);

const user = require("../models/User");
const userotp = require("../models/userOTP");

const saltRounds = 10;
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

async function generateAuthToken(newuser) {
  try {
    const token = await jwt.sign(
      {
        _id: newuser._id,
      },
      process.env.HASH_KEY
    );
    return token;
  } catch (error) {
    throw error;
  }
}

async function createUser(req, res) {
  var encryptedPassword = await bcrypt.hash(req.body.password, saltRounds);
  const newUser = new user({
    name: req.body.name,
    password: encryptedPassword,
    email: req.body.email,
    location: req.body.location,
  });

  const token = await generateAuthToken(newUser);
  const query = { email: req.body.email };

  const duplicateUser = await user.findOne(query);

  if (duplicateUser !== null) {
    res.send({ Success: false });
  } else {
    const userSave = {
      name: req.body.name,
      password: encryptedPassword,
      email: req.body.email,
      location: req.body.location,
      tokens: { token: token },
    };

    await user.create(userSave);
    res.send({ Success: true });
  }
}

async function loginUser(req, res) {
  const { email, password } = req.body;
  const findQuery = { email: email };
  const emailFind = await user.findOne(findQuery);

  if (emailFind) {
    var checkEncryptedPassword = await bcrypt.compare(
      password,
      emailFind.password
    );

    if (checkEncryptedPassword == true) {
      res.json({
        Success: true,
        AuthToken: emailFind.tokens.token,
        user: emailFind,
      });
    } else {
      res.json({ Success: false, msg: "Wrong Password" });
    }
  } else {
    res.json({ Success: false, msg: "Please Register First" });
  }
}

async function sendOTP(req, res) {
  const query = { email: req.body.email };
  const emailFind = await user.findOne(query);

  const UserFound = await user.findOne(query);
  if (UserFound) {
    const OTP = Math.floor(100000 + Math.random() * 900000);
    const existEmail = await userotp.findOne({ email: req.body.email });

    if (existEmail) {
      const updateData = await userotp.updateOne(
        { email: req.body.email },
        { $set: { otp: OTP } },
        { new: true }
      );
      const mailOptions = {
        from: process.env.EMAIL,
        to: req.body.email,
        subject: "Sending EMAIL for OTP Validation",
        text: `OTP: ${OTP}`,
      };
      await transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          throw err;
        }
      });
      res.send({
        Success: true,
        user: emailFind,
        AuthToken: emailFind.tokens.token,
        otp: OTP,
      });
    } else {
      const saveOtpData = new userotp({
        email: req.body.email,
        otp: OTP,
      });
      await saveOtpData.save();
      const mailOptions = {
        from: process.env.EMAIL,
        to: req.body.email,
        subject: "Sending EMAIL for OTP Validation",
        text: `OTP: ${OTP}`,
      };
      await transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          throw err;
        }
      });
      res.send({
        Success: true,
        user: emailFind,
        AuthToken: emailFind.tokens.token,
        otp: OTP,
      });
    }
  } else {
    res.send({ Success: false });
  }
}

async function changePassword(req, res) {
  const findQuery = { email: req.body.email };
  const FoundEmail = await user.findOne(findQuery);

  var checkEncryptedPassword = await bcrypt.compare(
    req.body.password,
    FoundEmail.password
  );

  if (checkEncryptedPassword === true) {
    var encryptedPassword = await bcrypt.hash(req.body.newPassword, saltRounds);
    const updatedEmail = await user.updateOne(findQuery, {
      $set: { password: encryptedPassword },
    });
    if (updatedEmail) {
      res.send({ Success: true });
    } else {
      res.send({ Success: false });
    }
  } else {
    res.send({ Success: false });
  }
}

async function updateImage(req, res) {
  const findQuery = { email: req.body.email };
  const FoundEmail = await user.findOneAndUpdate(
    findQuery,
    {
      $set: { imgUrl: req.body.pic },
    },
    {
      new: true,
    }
  );
  if (FoundEmail) {
    res.send({ Success: true, picUrl: FoundEmail.imgUrl, user: FoundEmail });
  } else {
    res.send({ Success: false });
  }
}

async function payment(req, res) {
  const { data } = req.body;

  const lineItems = data.map((product) => ({
    price_data: {
      currency: "inr",
      product_data: {
        name: product.name,
      },
      unit_amount: (product.price / product.qtyOrdered) * 100,
    },
    quantity: product.qtyOrdered,
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    success_url: "http://localhost:5173/success",
    cancel_url: "http://localhost:5173/cancel",
  });

  res.send({ Success: "true", sessionId: session.id });
}
module.exports = {
  createUser,
  loginUser,
  sendOTP,
  changePassword,
  updateImage,
  payment,
};
