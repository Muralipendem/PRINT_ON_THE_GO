import { useEffect } from "react";
import { useAuthContext } from "../../context/AuthContext";
import { extractTime } from "../../utils/extractTime";
import useConversation from "../../zustand/useConversation";

const Message = ({ message }) => {
    const { authUser } = useAuthContext();
    const { selectedConversation } = useConversation();
    const fromMe = message.senderId === authUser._id;
    const formattedTime = extractTime(message.createdAt);
    const chatClassName = fromMe ? "chat-end" : "chat-start";
    const profilePic = fromMe ? authUser.profilePic : selectedConversation?.profilePic;
    const bubbleBgColor = fromMe ? "bg-blue-500" : "";

    const shakeClass = message.shouldShake ? "shake" : "";

    useEffect(() => {
        const updateMessage = async () => {
            try {
                const response = await fetch(`/api/messages/${message._id}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                const data = await response.json();
                console.log("updateMessage data", data);
            } catch (error) {
                console.error("Error in updateMessage:", error);
            }
        };
        updateMessage();
    }, []);

    return (
        <div className={`chat ${chatClassName}`}>
            <div className='chat-image avatar'>
                <div className='w-10 rounded-full'>
                    <img alt='Profile Pic' src={profilePic} />
                </div>
            </div>
            <div className={`chat-bubble text-white ${bubbleBgColor} ${shakeClass} pb-2`}>
                {message.message.startsWith('ThisIsAFileCode') ? (
                    <div>
                        <p>  Order Created </p> 
                        <div className="flex flex-col gap-2">
                        {JSON.parse(message.message.replace('ThisIsAFileCode', '')).map((fileObj, index) => (
                        <div key={index} className="mt-2 bg-white overflow-hidden h-52 relative flex w-44 md:w-72 lg:w-72 rounded-t-xl rounded-b-lg">
                                            <div className="absolute ">
                                            {fileObj.file_url && (
                                fileObj.file_url.includes('.jpg') || fileObj.file_url.includes('.jpeg') || fileObj.file_url.includes('.png') || fileObj.file_url.includes('.gif') ? (
                                    <img
                                        src={fileObj.file_url}
                                        alt="Uploaded Preview"
                                        className=" cursor-pointer h-52   md:w-72 lg:w-72 w-44 object-cover rounded shadow hover:opacity-80 transition-opacity duration-300"
                                    />
                                ) : fileObj.file_url.includes('.pdf') ? (
                                    <iframe
                                        src={fileObj.file_url}
                                        className="w-full border cursor-pointer h-52 rounded shadow hover:opacity-80 transition-opacity duration-300"
                                        title="PDF Preview"
                                        href={fileObj.file_url}
                                    ></iframe>
                                ) : null
                            )}
                                            </div>
                                            <a
                                                href={fileObj.file_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-white-500 z-10 w-full bg-white border-t border-blue-500 px-5 py-3 mt-auto truncate underline text-blue-500"
                                            >
                                                File
                                            </a>
                                            </div>
                    ))}
                    </div>
                    </div>
                ) : (
                    message.message
                )}
            </div>
            <div className='chat-footer opacity-50 text-xs flex gap-1 items-center'>{formattedTime}</div>
        </div>
    );
};

export default Message;
