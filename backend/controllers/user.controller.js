import User from "../models/user.model.js";
import Order from "../models/orders.model.js";
import mongoose from "mongoose";
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
		const { pdfId, quantity, shopId, userId } = req.body;

		const user = await User.findById(userId).select("-password");
		const shop = await User.findById(shopId).select("-password");

		if(shop.role !== "shop") {
			return res.status(400).json({ error: "Invalid shop ID" });
		}

		const newOrder = new Order({
			userName: user.username,
			userPic: user.profilePic,
			userId: userId,
			pdfId: pdfId,
			quantity: quantity,
			shopName: shop.username,
			shopPic: shop.profilePic,
			shopId: shopId,
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
        // Extract userId from the request body
        const { userId } = req.body;

        // Validate the userId
        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: "Invalid or missing user ID" });
        }

        // Convert userId to ObjectId using 'new'
        const objectId = new mongoose.Types.ObjectId(userId);

		const user = await User.findById(userId).select("-password");

		if(user.role !== "user") {
			const orders = await Order.find({ shopId: objectId });
			return res.status(200).json(orders);
		}


        // Query the database for orders associated with this userId
        const orders = await Order.find({ userId: objectId });


        // Send orders back to the client
        res.status(200).json(orders);
    } catch (error) {
        console.error("Error in getOrders:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

// update Order status
export const updateOrderStatus = async (req, res) => {
	try {
		const { orderId, status } = req.body;

		// Validate the orderId
		if (!orderId || !mongoose.Types.ObjectId.isValid(orderId)) {
			return res.status(400).json({ error: "Invalid or missing order ID" });
		}

		// Find the order by ID and update the status
		const updatedOrder = await Order.findByIdAndUpdate(orderId, { status }, { new: true });

		// Send the updated order back to the client
		res.status(200).json(updatedOrder);
	} catch (error) {
		console.error("Error in updateOrderStatus:", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};
