import { useEffect } from "react";
import useConversation from "../../zustand/useConversation";
import MessageInput from "./MessageInput";
import Messages from "./Messages";
import { TiMessages } from "react-icons/ti";
import { useAuthContext } from "../../context/AuthContext";
import { FiMapPin } from "react-icons/fi";
import { MdDashboard } from "react-icons/md";
import { useNavigate } from "react-router-dom";
const MessageContainer = () => {
	const { selectedConversation, setSelectedConversation } = useConversation();

	useEffect(() => {
		// Cleanup function
		return () => setSelectedConversation(null);
	}, [setSelectedConversation]);
	const navigate = useNavigate();

	return (
		<div className="flex-grow flex flex-col md:min-w-[450px] bg-gray-100">
			{!selectedConversation ? (
				<NoChatSelected />
			) : (
				<>
					{/* Header */}
					<div className="bg-blue-600 flex justify-between items-center text-white px-4 py-2 mb-2 rounded-b-lg">
						<div>
						<span className="label-text">To:</span>{" "}
						<span className="font-bold">{selectedConversation.fullName}</span>
						</div>
						{/* go to /map and go to / */}
						<div className="flex items-center gap-4 ">
						<MdDashboard className="hover:text-green-500" onClick={() => navigate('/')} />
						<FiMapPin className="hover:text-red-500" onClick={() => navigate('/map')} />
						</div>


					</div>
					<Messages selectedConversation={selectedConversation} />
					<MessageInput />
				</>
			)}
		</div>
	);
};
export default MessageContainer;

const NoChatSelected = () => {
	const { authUser } = useAuthContext();
	return (
		<div className="flex items-center justify-center w-full h-full">
			<div className="px-4 text-center sm:text-lg md:text-xl text-gray-700 font-semibold flex flex-col items-center gap-4">
				<p>Welcome 👋 {authUser.fullName} ❄</p>
				<p>Select a chat to start messaging</p>
				<TiMessages className="text-5xl text-blue-600" />
			</div>
		</div>
	);
};
// STARTER CODE SNIPPET
// import MessageInput from "./MessageInput";
// import Messages from "./Messages";

// const MessageContainer = () => {
// 	return (
// 		<div className='md:min-w-[450px] flex flex-col'>
// 			<>
// 				{/* Header */}
// 				<div className='bg-slate-500 px-4 py-2 mb-2'>
// 					<span className='label-text'>To:</span> <span className='text-gray-900 font-bold'>John doe</span>
// 				</div>

// 				<Messages />
// 				<MessageInput />
// 			</>
// 		</div>
// 	);
// };
// export default MessageContainer;
