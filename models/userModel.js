const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

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

    photo: {
      type: String,
      default:
        "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAMAAzAMBIgACEQEDEQH/xAAbAAEAAgMBAQAAAAAAAAAAAAAABAUBAgYDB//EADEQAQACAQIDBwIEBwEAAAAAAAABAgMEEQUhMRITMkFRUmEicUJyobEjM4GRksHRFP/EABQBAQAAAAAAAAAAAAAAAAAAAAD/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwD6SAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM1rN7RWsTMz0iFppOGxERbU/VPtjpAK3HiyZZ2x0tafhJx8N1FusVp95XVK1pG1YiI9IhsCpjhN/PLXf8rW3Cs0eHJSVwA57Los+LnfHO3rXaXh0dQjajSYs8T2q7W90AoBI1Wjyaad7c6T0tH+0cAAAAAAAAAAAAAABmtbWtFaxvMztEMLXhOmiK/wDotHO0fTHoCRotHXT1mZ+rJPWyWR0AAAAAAAa3rF6zW0RMT1iVJr9JOntE0/l2n+y9aZcdcuOaW6SDmh6Z8U4c1sdusebzAAAAAAAAAAAABvhxzly0xx+KXR0rFaxFekRtCm4TTtanefwxuuwAAAAAAAAAAVnGMUTFcu3SezKqdBradvS5Y89t3PgAAAAAAAAAAAAsuC+PL9oWyo4Nb+Lkr5zC3AAAAAAAAAABpl/l3/LLmnSZ7dnDktPlWXNgAAAAAAAAAAAAk8Pyxi1dZmeVuS/cvE7dOv7Og0ebv8FbT4ulo+QSAAAAAAAAAAQuKZe70sx53nZSJnFM/e6iax4cf0/180MAAAAAAAAAAAABJ0OpnTZd58FvFCMA6etotWLVneJ6SyotFrZ089i+9scz/iuseSmSsWpaLRPoDcAAAAABB4jq4wY5pjmJyW5fZnW66mGOzj2tk/SFLe9r2m153tPWQYAAAAAAAAAAAAAAGaxNpitYmZnpELXR8Miu19Rzt7fKAQtLosmo5xEVr7pj9lvptLTTV2x77z1mZ6veI2jZkAAAABiY3ZAVeq4ZG/a088/ZbzVt6Wx27N4mLfLpnjqNNj1FJrev2nzgHOzyEjV6PJpp5x2qeVoRwAAAAAAAAAAG2LHfLeKY43tPSPRilZteK1je1uUQvtFpa6fH63nxWBro9FTT135TkmOdksgAAAAAAAAAABrasXrNbRExPkptdoJwzOTFEzjnrHou2JjeJj1BzHL1E3iOknTzOTHH8OevwhAAAAAAAA99Dh7/AFFaz4Y52BYcK0vYx97ePrtHL4hYxGzERt/xkAAAAAAAAAAAAAAGuSlb1mt43iY5w5/VYLYM00np5T8OiQuKYO8083rH1U5x9gUgAAAAAC34Nh7OG2WY53nl9lRLo9LTu8FKelQeoAAAAAAAAAAAAAAADFo3jnDIDm9Rj7rPkx+2f0eafxjH2c9b+6EAAAAAHpp69vPjr62h0cKHhte1rMfxvK+BkAAAAAAAAAAAAAAAAkAV/GKb4K39tlOvuJ17WiyfG0qEAAH/2Q==",
    },

    password: {
      required: true,
      type: String,
    },
    phoneNumber: {
      type: String, 
    
    },
    address: {
      type: String
    },
    city: {
      type: String
    },
    country: {
      type: String
    },
    state: {
      type: String
    },
    website: {
      type: String,
    },
    userWebTag: {
      type: String,
      // required: true,
    },
    completedOnboarding: {
      type: Boolean,
      default: false,
    },
    facebookId: {
      type: String,
      // unique: true
    },
    googleId: {
      type: String,
      // unique: true
    },
    tiktokId: {
      type: String,
      // unique: true
    },
    linkedinId: {
      type: String,
      // unique: true,
    },

    ad_spend: {
      type: Number
    },
    ad_sales: {
      type: Number
    },

    campaigns:[{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campaign"
    }],

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
