const mongoose = require("mongoose");
const bcrypt = require("bcryptjs")


const userSchema = new mongoose.Schema(
  {
    fullName: {
      required: true,
      type: String,
    },

    email: {
      unique: true,
      required: true,
      type: String,
    },

    password: {
      required: true,
      type: String,
    },
    website: {
      type: String,
      // required: true, 
      unique: true,
    },
    userWebTag: {
      type: String,
      // required: true, 
    },
    completedOnboarding: {
      type: Boolean,
      default: false
    },
    

    passwordResetToken: String,
    passwordResetExpires: Date,
    passwordChangedAt: Date,
  },
  { timestamps: true }
);


userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 16);
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.createResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  console.log(resetToken, this.passwordResetToken);
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

userSchema.methods.comparePassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};


module.exports = mongoose.model("User", userSchema);
