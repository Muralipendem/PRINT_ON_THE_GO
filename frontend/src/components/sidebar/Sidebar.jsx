import Conversations from "./Conversations";
import LogoutButton from "./LogoutButton";
import SearchInput from "./SearchInput";

const Sidebar = ( ) => {
	return (
		<div className="w-full md:w-fit border-r h-[100vh] border-gray-300 bg-white p-4 flex flex-col">
			<SearchInput />
			<div className="divider border-t border-gray-300 my-4"></div>
			<Conversations />
			<div className="mt-auto">
				<LogoutButton />
			</div>
		</div>
	);
};
export default Sidebar;

// STARTER CODE FOR THIS FILE
// import Conversations from "./Conversations";
// import LogoutButton from "./LogoutButton";
// import SearchInput from "./SearchInput";

// const Sidebar = () => {
// 	return (
// 		<div className='border-r border-slate-500 p-4 flex flex-col'>
// 			<SearchInput />
// 			<div className='divider px-3'></div>
// 			<Conversations />
// 			<LogoutButton />
// 		</div>
// 	);
// };
// export default Sidebar;
