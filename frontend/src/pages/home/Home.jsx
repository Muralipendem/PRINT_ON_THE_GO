import { useState, useEffect } from "react";
import MessageContainer from "../../components/messages/MessageContainer";
import Sidebar from "../../components/sidebar/Sidebar";
import useConversation from "../../zustand/useConversation";

const Home = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State for sidebar open/close
  const [isMobile, setIsMobile] = useState(false); // State to check if it's mobile view
  const { selectedConversation, setSelectedConversation } = useConversation();
  // Check window size on load and resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsMobile(true); // Mobile size (below 768px)
      } else {
        setIsMobile(false); // Desktop size (above 768px)
      }
    };

    handleResize(); // Call initially to check size

    // Add resize event listener to check window size on resize
    window.addEventListener("resize", handleResize);

    // Cleanup event listener
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // get id from /?id=67683c99928f5bde6b86ae9e
    const urlParams = new URLSearchParams(window.location.search);
    const conversationId = urlParams.get("id");
    if (conversationId) {
      const getConversation = async () => {
        try {
          const res = await fetch(`/api/users/user/${conversationId}`);
          const data = await res.json();
    
          if (data.error) {
            throw new Error(data.error);
          }
    
          // Ensure only one user is set in conversations
          setSelectedConversation([data]); // Replace conversations with the single user
          
          // Automatically select the conversation
          setSelectedConversation(data);
          setSearch(""); // Clear the search input
        } catch (error) {
          toast.error(error.message);
        }
      };
      getConversation().then(() => {
        console.log("Conversation fetched");
      });
    }

  }
  , []);


  return (
    <div className="relative flex flex-col md:flex-row h-screen">
      {/* Mobile Header */}
      {isMobile && (
        <div className="flex items-center justify-between bg-blue-600 text-white p-2 shadow-md md:hidden">
          <h1 className="text-xl font-semibold">Print On Go</h1>
          <button
            className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-white"
            onClick={() => setIsSidebarOpen(true)}
          >
            {/* Hamburger Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>
      )}

      {/* Sidebar for Mobile */}
      {isMobile && (
        <div
          className={`fixed inset-y-0 left-0 w-[95vw] bg-gray-800 text-white z-50 transform transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <Sidebar />

          {/* Close Button for Mobile Sidebar */}
          <button
            className="absolute top-4 right-4 p-2 bg-gray-700 rounded-full text-white md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      )}

      {/* Main Content for Desktop */}
      <div className="flex-1 bg-gray-100 h-[100vh] w-[100vw] rounded-xl">
        <div className="flex h-full rounded-lg overflow-hidden bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0">
          {/* Sidebar on Desktop */}
          {!isMobile && <Sidebar />}
          {/* MessageContainer */}
          <MessageContainer />
        </div>   
      </div>

      {/* Overlay for Mobile */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default Home;
