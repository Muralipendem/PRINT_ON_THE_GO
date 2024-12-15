import { useSocketContext } from "../../context/SocketContext";
import useConversation from "../../zustand/useConversation";

const Conversation = ({ conversation, lastIdx, emoji }) => {
	const { selectedConversation, setSelectedConversation } = useConversation();
	const { onlineUsers } = useSocketContext();

	// Determine if the conversation is selected or online
	const isSelected = selectedConversation?._id === conversation._id;
	const isOnline = onlineUsers.includes(conversation._id);

	return (
		<>
			<div
				className={`flex gap-4 items-center p-3 rounded-lg cursor-pointer transition-all duration-300 
				${isSelected ? "bg-sky-500 text-white" : "hover:bg-sky-100"}
			`}
				onClick={() => setSelectedConversation(conversation)}
			>
				{/* Avatar Section */}
				<div className={`avatar ${isOnline ? "online" : ""}`}>
					<div className="w-12 h-12 rounded-full border-2 border-gray-300 overflow-hidden">
						<img
							src={conversation.profilePic}
							alt={`${conversation.fullName}'s avatar`}
							className="object-cover w-full h-full"
						/>
					</div>
				</div>

				{/* Conversation Details */}
				<div className="flex flex-col flex-1">
					<div className="flex justify-between items-center">
						<p
							className={`font-bold ${
								isSelected ? "text-white" : "text-gray-800"
							} truncate`}
						>
							{conversation.fullName}
						</p>
						<span
							className={`text-xl ${
								isSelected ? "text-white" : "text-gray-600"
							}`}
						>
							{emoji}
						</span>
					</div>
				</div>
			</div>

			{/* Divider */}
			{!lastIdx && <div className="divider border-t border-gray-300 mx-2" />}
		</>
	);
};

export default Conversation;

// STARTER CODE SNIPPET
// const Conversation = () => {
// 	return (
// 		<>
// 			<div className='flex gap-2 items-center hover:bg-sky-500 rounded p-2 py-1 cursor-pointer'>
// 				<div className='avatar online'>
// 					<div className='w-12 rounded-full'>
// 						<img
// 							src='https://cdn0.iconfinder.com/data/icons/communication-line-10/24/account_profile_user_contact_person_avatar_placeholder-512.png'
// 							alt='user avatar'
// 						/>
// 					</div>
// 				</div>

// 				<div className='flex flex-col flex-1'>
// 					<div className='flex gap-3 justify-between'>
// 						<p className='font-bold text-gray-200'>John Doe</p>
// 						<span className='text-xl'>🎃</span>
// 					</div>
// 				</div>
// 			</div>

// 			<div className='divider my-0 py-0 h-1' />
// 		</>
// 	);
// };
// export default Conversation;
