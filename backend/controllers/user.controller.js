import User from "../models/user.model.js";
import Order from "../models/orders.model.js";

// Fetch users for the sidebar
export const getUsersForSidebar = async (req, res) => {
	try {
		const loggedInUserId = req.user._id;

		// Fetch the logged-in user's CommunicatedUsers list
		const loggedInUser = await User.findById(loggedInUserId).select("CommunicatedUsers");

		if (!loggedInUser) {
			return res.status(404).json({ error: "Logged-in user not found" });
		}

		// Fetch users in the CommunicatedUsers list, excluding the password
		const communicatedUsers = await User.find({
			_id: { $in: loggedInUser.CommunicatedUsers },
		}).select("-password");

		res.status(200).json(communicatedUsers);
	} catch (error) {
		console.error("Error in getUsersForSidebar:", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

// Fetch shops for the map within a range
export const getShopsForMap = async (req, res) => {
	try {
		const { longitude, latitude, maxDistance } = req.body;

		// Validate input
		if (!longitude || !latitude) {
			return res.status(400).json({ error: "Longitude and latitude are required" });
		}

		// Parse input values
		const long = parseFloat(longitude);
		const lat = parseFloat(latitude);
		const distance = parseFloat(maxDistance) || 5; // Default to 5 kilometers

		// Approximate degree difference for distance calculation
		const degreeDistance = distance / 111; // 1 degree latitude ≈ 111 km

		// Query shops within the specified range
		const shops = await User.find({
			role: "shop", // Fetch only shops
			longitude: { $gte: long - degreeDistance, $lte: long + degreeDistance },
			latitude: { $gte: lat - degreeDistance, $lte: lat + degreeDistance },
		});

		res.status(200).json(shops);
	} catch (error) {
		console.error("Error in getShopsForMap:", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

// Fetch a user by username
export const getUserByname = async (req, res) => {
	try {
		const { username } = req.params;

		// Fetch user by username and exclude the password
		const user = await User.findOne({ username }).select("-password");

		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		res.status(200).json(user);
	} catch (error) {
		console.error("Error in getUserByname:", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

// get user by id
export const getUserById = async (req, res) => {
	try {
		const { id } = req.params;
		// Fetch user by id and exclude the password
		const user = await User.findById(id).select("-password");
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		res.status(200).json(user);
	} catch (error) {
		console.error("Error in getUserById:", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};


// Post a new order
export const postOrder = async (req, res) => {
	try {
		const { pdfId, quantity, shopId } = req.body;
		const userId = req.user._id;

		// Create a new order
		const newOrder = new Order({
			userId,
			pdfId,
			quantity,
			shopId,
		});

		await newOrder.save();

		res.status(201).json(newOrder);
	} catch (error) {
		console.error("Error in postOrder:", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

// Fetch all orders
export const getOrders = async (req, res) => {
	try {
		const orders = await Order.find()
			.populate("userId", "username email") // Populate user details
			.populate("file", "title") // Populate PDF details
			.populate("shopId", "name"); // Populate shop details

		res.status(200).json(orders);
	} catch (error) {
		console.error("Error in getOrders:", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};
