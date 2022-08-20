const crypto = require("crypto");
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");
const { send } = require("process");

exports.login = async (req, res, next) => {
  const { username, password } = req.body;


  if (!username || !password) {
    return next(new ErrorResponse("Please provide an email and password", 400));
  }

  try {

    const user = await User.findOne({ username }).select("+password");

    if (!user) {
      return next(new ErrorResponse("Invalid credentials", 401));
    }


    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return next(new ErrorResponse("Invalid credentials", 401));
    }

    sendToken(user, 200, res);
  } catch (err) {
    next(err);
  }
};


exports.register = async (req, res, next) => {
  const { name, username, email, password } = req.body;

  const verificationToken = crypto
    .createHash("sha256")
    .digest("hex");



  try {
    const user = await User.create({
      name,
      username,
      email,
      password,
      verificationToken,
      verified: false
    });

    const verifyUrl = `http://localhost:4000/api/auth/verify/${verificationToken}`;
    const message = `
      <h1>You have requested a password reset</h1>

      <p>Please make a put request to the following link:</p>
      <form method="PUT" action="${verifyUrl}">
        <input  type="button" name="button" value="Verify" />
      </form>
    `;
    try {
      await sendEmail({ 'subject': 'account creatation', 'to': email, 'text': message });
    }

    catch (err) {
      console.log(err);
    }

    sendToken(user, 200, res);

  } catch (err) {
    next(err);
  }
};

// @desc    Forgot Password Initialization
exports.forgotPassword = async (req, res, next) => {
  // Send Email to email provided but first check if user exists
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return next(new ErrorResponse("No email could not be sent", 404));
    }

    // Reset Token Gen and add to database hashed (private) version of token
    const resetToken = user.getResetPasswordToken();

    await user.save();

    // Create reset url to email to provided email
    const resetUrl = `http://localhost:4000/api/auth/verify/${resetToken}`;

    // HTML Message
    const message = `
      <h1>You have requested a password reset</h1>

      <p>Please make a put request to the following link:</p>
      <form method="put" action="${resetUrl}">
        <input  type="button" name="button" value="Verify" />
      </form>
    `;

    try {
      await sendEmail({
        to: user.email,
        subject: "Password Reset Request",
        text: message,
      });

      res.status(200).json({ success: true, data: "Email Sent" });
    } catch (err) {
      console.log(err);

      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save();

      return next(new ErrorResponse("Email could not be sent", 500));
    }
  } catch (err) {
    next(err);
  }
};

// @desc    Reset User Password
exports.resetPassword = async (req, res, next) => {
  // Compare token in URL params to hashed token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resetToken)
    .digest("hex");

  try {
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return next(new ErrorResponse("Invalid Token", 400));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(201).json({
      success: true,
      data: "Password Updated Success",
      token: user.getSignedJwtToken(),
    });
  } catch (err) {
    next(err);
  }
};

const sendToken = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();
  res.cookie('token', token, { httpOnly: true, maxAge: 60 * 60 * 24 * 1000 * 7 });
  res.sendStatus(200);
};

exports.verify = async (req, res, next) => {
  // const verificationToken = crypto
  //   .createHash("sha256")
  //   .update(req.params.verificationToken)
  //   .digest("hex");
  const verificationToken = req.params.verificationToken;
  try {
    const user = await User.findOne({ verificationToken });
    if (user === null)
      res.send('Token has expired.');
    user.verificationToken = verificationToken;
    user.verified = true;
    user.save();
    res.sendStatus(200);
  }
  catch (err) {
    console.log(err);
  }

}