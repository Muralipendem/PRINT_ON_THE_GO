import { useEffect, useRef } from "react";
import useGetMessages from "../../hooks/useGetMessages";
import MessageSkeleton from "../skeletons/MessageSkeleton";
import Message from "./Message";
import useListenMessages from "../../hooks/useListenMessages";

const Messages = ({ selectedConversation }) => {
	const { messages, loading } = useGetMessages();
	useListenMessages(selectedConversation);
	const lastMessageRef = useRef();

	useEffect(() => {
		// Smoothly scroll to the last message whenever messages update
		lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	return (
		<div
			className="flex-1 px-4 overflow-x-hidden h-full"
			style={{ maxHeight: "calc(100vh - 150px)" }} // Ensure it adapts to viewport size
		>
			{/* Display Messages */}
			{!loading &&
				messages.length > 0 &&
				messages.map((message, idx) => (
					<div
						key={message._id}
						ref={idx === messages.length - 1 ? lastMessageRef : null}
					>
						<Message message={message} />
					</div>
				))}

			{/* Seen/Not Seen Indicator */}
			{/* {messages.length > 0 && (
				<p className="text-right text-sm text-gray-400">
					{messages[messages.length - 1]?.viewed ? "Seen" : "Not seen"}
				</p>
			)} */}

			{/* Loading Skeletons */}
			{loading && [...Array(3)].map((_, idx) => <MessageSkeleton key={idx} />)}

			{/* No Messages */}
			{!loading && messages.length === 0 && (
				<p className="text-center text-gray-500">
					Send a message to start the conversation
				</p>
			)}
		</div>
	);
};

export default Messages;
