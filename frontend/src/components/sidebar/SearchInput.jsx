import { useState } from "react";
import { IoSearchSharp } from "react-icons/io5";
import useConversation from "../../zustand/useConversation";
import useGetConversations from "../../hooks/useGetConversations";
import toast from "react-hot-toast";

const SearchInput = () => {
	const [search, setSearch] = useState("");
	const { setSelectedConversation } = useConversation();
	// const { conversations } = useGetConversations();
	const [conversations, setConversations] = useState([]);

	const handleSubmit = (e) => {
		e.preventDefault();
		
		// Clear the conversations array
		setConversations([]);
		
		if (!search) return;
		
		if (search.length < 3) {
			return toast.error("Search term must be at least 3 characters long");
		}
	
		// Function to fetch a user by username
		const getConversation = async () => {
			try {
				const res = await fetch(`/api/users/${search}`);
				const data = await res.json();
	
				if (data.error) {
					throw new Error(data.error);
				}
	
				// Ensure only one user is set in conversations
				setConversations([data]); // Replace conversations with the single user
				
				// Automatically select the conversation
				setSelectedConversation(data);
				setSearch(""); // Clear the search input
			} catch (error) {
				toast.error(error.message);
			}
		};
		getConversation();
	};
	
	return (
		<form onSubmit={handleSubmit} className='flex items-center gap-2'>
			<div>
			<input
				type='text'
				placeholder='Search…'
				className='input input-bordered rounded-full'
				value={search}
				onChange={(e) => setSearch(e.target.value)}
			/>
			{/* getting the conversations data  displaying
			 the data is like this 
			 {
    "profilePic": "",
    "CommunicatedUsers": [],
    "_id": "674eca30a685af9173caec40",
    "username": "karthik",
    "role": "shop",
    "createdAt": "2024-12-03T09:06:56.462Z",
    "updatedAt": "2024-12-03T09:06:56.462Z",
    "__v": 0
}
			*/}
			 {
				conversations.length > 0 && (
					<div className="border-2 border-gray-300 cursor-pointer hover:bg-blue-500 hover:text-white rounded-md p-2 text-black">
				{conversations.map((conversation) => (
					<div key={conversation._id} onClick={() => {
						setSelectedConversation(conversation);
						setConversations([]);
						console.log(conversation);
					}}>
						{conversation.username}
					</div>
				))}	
				</div>
				)
			 }

			</div>
			<button type='submit' className='btn btn-circle bg-sky-500 text-white'>
				<IoSearchSharp className='w-6 h-6 outline-none' />
			</button>

		</form>
	);
};
export default SearchInput;

// STARTER CODE SNIPPET
// import { IoSearchSharp } from "react-icons/io5";

// const SearchInput = () => {
// 	return (
// 		<form className='flex items-center gap-2'>
// 			<input type='text' placeholder='Search…' className='input input-bordered rounded-full' />
// 			<button type='submit' className='btn btn-circle bg-sky-500 text-white'>
// 				<IoSearchSharp className='w-6 h-6 outline-none' />
// 			</button>
// 		</form>
// 	);
// };
// export default SearchInput;
