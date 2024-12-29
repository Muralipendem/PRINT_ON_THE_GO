import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		fullName: { type: String, required: true },
		username: { type: String, required: true, unique: true },
		password: { type: String, required: true, minlength: 6 },
		profilePic: { type: String, default: "" },
		CommunicatedUsers: { type: Array, default: [] },
		role: { type: String, default: "user", required: true, enum: ["shop", "user"] },
		longitude: { type: Number, default: 0 },
		latitude: { type: Number, default: 0 },
		address: {type: String, required: true},
	},
	{ timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
