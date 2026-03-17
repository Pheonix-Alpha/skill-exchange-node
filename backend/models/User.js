import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true, // 🔥 important
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    skillsOffered: {
      type: [String],
      default: [],
    },

    skillsWanted: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);


// 🔥 Normalize skills before saving (VERY IMPORTANT)
userSchema.pre("save", function (next) {
  if (this.skillsOffered) {
    this.skillsOffered = this.skillsOffered.map((s) =>
      s.toLowerCase().trim()
    );
  }

  if (this.skillsWanted) {
    this.skillsWanted = this.skillsWanted.map((s) =>
      s.toLowerCase().trim()
    );
  }

  next();
});


// 🔥 Add indexes for faster matching
userSchema.index({ skillsOffered: 1 });
userSchema.index({ skillsWanted: 1 });

export default mongoose.model("User", userSchema);