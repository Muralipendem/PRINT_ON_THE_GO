import { useEffect } from "react";

import { useSocketContext } from "../context/SocketContext";
import useConversation from "../zustand/useConversation";

import notificationSound from "../assets/sounds/notification.mp3";

const useListenMessages = (selectedConversation) => {
	const { socket } = useSocketContext();
	const { messages, setMessages } = useConversation();

	useEffect(() => {
		socket?.on("newMessage", (newMessage) => {
			newMessage.shouldShake = true;
			const sound = new Audio(notificationSound);
			sound.play();
			// setMessages([...messages, newMessage]); only if the selected conversation is the same as the new message
			console.log("newMessage", newMessage);
			console.log("selectedConversation", selectedConversation);
			if (selectedConversation?._id === newMessage?.senderId) {
				setMessages([...messages, newMessage]);
			}
			
		});

		return () => socket?.off("newMessage");
	}, [socket, setMessages, messages]);
};
export default useListenMessages;
