import User from "../models/user.model.js";
import Order from "../models/orders.model.js";
export const getUsersForSidebar = async (req, res) => {
	try {
		const loggedInUserId = req.user._id;

		// Fetch the logged-in user's CommunicatedUsers list
		const loggedInUser = await User.findById(loggedInUserId).select("CommunicatedUsers");

		if (!loggedInUser) {
			return res.status(404).json({ error: "Logged-in user not found" });
		}

		// Fetch only the users in the CommunicatedUsers list
		const communicatedUsers = await User.find({
			_id: { $in: loggedInUser.CommunicatedUsers }
		}).select("-password"); // Exclude password field

		res.status(200).json(communicatedUsers);
	} catch (error) {
		console.error("Error in getUsersForSidebar: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const getUserByname = async (req, res) => {
	try {
		const { username } = req.params;

		const user = await
			User.findOne({ username }).select("-password"); // Exclude password field

		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		res.status(200).json(user);
	} catch (error) {
		console.error("Error in getUserByname: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const postOrder = async (req, res) => {
	try {
		const { pdfId, quantity, shopId } = req.body;
		const userId = req.user._id;

		const newOrder = new Order({
			userId,
			pdfId,
			quantity,
			shopId
		});

		await newOrder.save();

		res.status(201).json(newOrder);
	} catch (error) {
		console.error("Error in postOrder: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const getOrders = async (req, res) => {
	try {
		const orders = await Order.find()
			.populate('userId', 'username email')  // Populating user details
			.populate('file', 'title')            // Populating PDF details
			.populate('shopId', 'name');           // Populating shop details

		res.status(200).json(orders);
	} catch (error) {
		console.error("Error in getOrders: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};



