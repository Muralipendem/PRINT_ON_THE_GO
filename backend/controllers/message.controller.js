import mongoose from "mongoose";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";
import User from "../models/user.model.js";

export const sendMessage = async (req, res) => {
	try {
		const { message } = req.body;
		const { id: receiverId } = req.params; // Receiver's ID
		const senderId = req.user._id; // Sender's ID (from authenticated user)

		// Validate IDs
		if (!mongoose.Types.ObjectId.isValid(senderId) || !mongoose.Types.ObjectId.isValid(receiverId)) {
			return res.status(400).json({ error: "Invalid senderId or receiverId" });
		}

		// Find or create a conversation between sender and receiver
		let conversation = await Conversation.findOne({
			participants: { $all: [senderId, receiverId] },
		});

		if (!conversation) {
			conversation = await Conversation.create({
				participants: [senderId, receiverId],
			});
		}

		// Create a new message
		const newMessage = new Message({
			senderId,
			receiverId,
			message,
		});

		// Add the new message to the conversation's messages array
		if (newMessage) {
			conversation.messages.push(newMessage._id);
		}

		// Save conversation and message in parallel
		await Promise.all([conversation.save(), newMessage.save()]);

		// Debug: Log the IDs
		console.log("Sender ID:", senderId);
		console.log("Receiver ID:", receiverId);

		// Update CommunicatedUsers list
		await Promise.all([
			User.updateOne(
				{ _id: senderId },
				{ $addToSet: { CommunicatedUsers: receiverId } }
			),
			User.updateOne(
				{ _id: receiverId },
				{ $addToSet: { CommunicatedUsers: senderId } }
			),
		]);

		// SOCKET.IO Functionality
		const receiverSocketId = getReceiverSocketId(receiverId);
		if (receiverSocketId) {
			// Notify receiver about the new message
			io.to(receiverSocketId).emit("newMessage", newMessage);
		}

		// Respond with the new message
		res.status(201).json(newMessage);
	} catch (error) {
		console.error("Error in sendMessage controller:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};



// file sharing
export const sendFile = async (req, res) => {
	try {
		const { fileUrl, fileName } = req.body;
		const { id: receiverId } = req.params;
		const senderId = req.user._id;

		let conversation = await Conversation.findOne({
			participants: { $all: [senderId, receiverId] },
		});

		if (!conversation) {
			conversation = await Conversation.create({
				participants: [senderId, receiverId],
			});
		}

		const newMessage = new Message({
			senderId,
			receiverId,
			fileUrl,
			fileName,
		});

		if (newMessage) {
			conversation.messages.push(newMessage._id);
		}

		await Promise.all([conversation.save(), newMessage.save()]);

		const receiverSocketId = getReceiverSocketId(receiverId);
		if (receiverSocketId) {
			io.to(receiverSocketId).emit("newMessage", newMessage);
		}

		res.status(201).json(newMessage);
	} catch (error) {
		console.log("Error in sendFile controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

// update the message to viewed
export const updateMessageToViewed = async (req, res) => {
	try {
		const { id: messageId } = req.params;

		const message = await Message 
		.findByIdAndUpdate(messageId, { viewed: true }, { new: true });

				if (!message) {
					return res.status(404).json({ error: "Message not found" });
				}

				res.status(200).json(message);
			} catch (error) {
				console.error("Error in updateMessageToViewed controller:", error);
				res.status(500).json({ error: "Internal server error" });
			}
		};

export const getMessages = async (req, res) => {
	try {
		const { id: userToChatId } = req.params;
		const senderId = req.user._id;

		const conversation = await Conversation.findOne({
			participants: { $all: [senderId, userToChatId] },
		}).populate("messages"); // NOT REFERENCE BUT ACTUAL MESSAGES

		if (!conversation) return res.status(200).json([]);

		const messages = conversation.messages;

		res.status(200).json(messages);
	} catch (error) {
		console.log("Error in getMessages controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};


// delete chat with conversation id

export const deleteChat = async (req, res) => {
	try {
		const { senderId, receiverId } = req.body;

		const conversation = await Conversation.findOneAndDelete({
			participants: { $all: [senderId, receiverId] },
		});

		if (!conversation) {
			return res.status(404).json({ error: "Conversation not found" });
		}

		res.status(200).json({ message: "Conversation deleted successfully" });
	} catch (error) {
		console.error("Error in deleteChat controller:", error);
		res.status(500).json({ error: "Internal server error" });
	}
}
