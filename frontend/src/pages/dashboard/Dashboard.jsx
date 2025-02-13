import React, { useEffect, useState } from 'react';
import { useAuthContext } from '../../context/AuthContext';
import { use } from 'react';
import { useNavigate } from 'react-router-dom';
import useLogout from '../../hooks/useLogout';
import { BiLogOut } from "react-icons/bi";
import { ref, deleteObject } from 'firebase/storage';
import { storage } from '../../firebase'; // Ensure you have Firebase storage initialized

const Dashboard = () => {
    const { authUser } = useAuthContext();
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();
    const { loading, logout } = useLogout();
    useEffect(() => {
        
        fetchOrders();

    }, []);
    const fetchOrders = async () => {
        try {
            const response = await fetch("/api/users/getOrders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: authUser._id, // Ensure this is a valid string
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to fetch orders");
            }

            const data = await response.json();
            // setOrders(data); // Update your state with fetched orders reverse order
            setOrders(data.reverse()); // Update your state with fetched orders in reverse order

        } catch (error) {
            console.error("Error fetching orders:", error.message);
        }

    }

    const UpdateOrder = async (orderId, status, pdfs, shopId) => {
        try {
            const response = await fetch("/api/users/updateOrder", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    orderId: orderId, 
                    status: status, 
                }),
            });
    
            if (!response.ok) {
                throw new Error("Failed to update order");
            }
            fetchOrders();
    
            if (status === "cancelled" || status === "completed") {
                alert("Deleting Files...");
                const response1 = await fetch("/api/messages/deleteChat", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        senderId: authUser._id,
                        receiverId: shopId,
                    }),
                });
                
                // Use Promise.all to ensure all deletions complete
                await Promise.all(pdfs.map(async (pdfUrl) => {
                    try {
                        const storageRef = ref(storage, pdfUrl); // Correctly reference storage
                        await deleteObject(storageRef);
                        console.log(`Deleted: ${pdfUrl}`);
                    } catch (error) {
                        console.error("Error deleting PDF:", error.message);
                    }
                }));
    
                alert("Order Updated Successfully");
            }
    
        } catch (error) {
            console.error("Error updating order:", error.message);
        }
    };
    

    

    return (
        <div className="w-screen h-full bg-gray-100 px-5 py-5">
            <div className='flex justify-between items-center'>
                <h1 className="lg:text-2xl md:text-2xl text-sm text-gray-500 whitespace-nowrap font-semibold mb-4">Welcome {authUser.username}</h1>
                <div className='flex gap-2'>
                    {authUser.role === "user" && <button onClick={() => { navigate('/map') }} className='bg-blue-500 px-5 py-3 whitespace-nowrap text-white rounded-xl text-base'> Create Order </button>}
                    <button className='bg-red-500 px-5 md:block lg:block hidden text-white py-3 rounded-xl' onClick={logout}>Logout</button>
                    <div className='text-2xl bg-red-500 py-2 px-3 rounded-xl flex items-center justify-center md:hidden lg:hidden text-white' onClick={logout}>
                    <BiLogOut  />
                    </div>
                </div>
            </div>
            <h2 className="text-xl text-gray-500 font-semibold mb-4 ml-5">Your Orders</h2>
            {
                orders.length === 0 ? <h1 className="text-sm text-gray-500 font-semibold mb-4 ml-5">No Orders</h1> : 
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-[80vh] py-5 px-5 w-full overflow-auto">
                {orders.map((order) => (
                    <div key={order._id} className={`bg-white shadow-md rounded-lg p-4  no-scrollbar overflow-auto ${orders.length <= 2 ? "max-h-[300px]" : "min-h-[30vh]"}`}>
                        <div className="flex items-center mb-4">
                            {authUser.role === "user" ? <img src={order.shopPic} alt="shop" className="w-12 h-12 rounded-full mr-4" /> : <img src={order.userPic} alt="user" className="w-12 h-12 rounded-full mr-4" />}
                            <div>
                                {authUser.role === "user" ? <h3 className="text-xl text-gray-700 font-semibold">{order.shopName}</h3> : <h3 className="text-xl text-gray-700 font-semibold">{order.userName}</h3>}
                                <p className="text-gray-500">{new Date(order.orderDate).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <div className="mb-4">
                            <div className='flex justify-between gap-5 items-center'>
                                <p className="text-gray-700">Status: <span className={`${order.status === "pending" ? "text-yellow-500" : order.status === "completed" ? "text-green-500" : "text-red-500"}`}>{order.status}</span> </p>
                                {
                                         order.status === "pending" && <>
                                        {authUser.role === "shop" ? <a href={`/chat?id=${order.userId}`} className='bg-blue-500 h-fit py-2 px-3 rounded-xl font-semibold text-white cursor-pointer whitespace-nowrap text-sm' > Chat with User
                                            </a> : <a href={`/chat?id=${order.shopId}`} className='bg-blue-500 h-fit py-2 px-3 rounded-xl font-semibold text-white cursor-pointer whitespace-nowrap text-sm' > Chat with Shop
                                            </a>}
                                        </>
                                    }
                                {(order.status === "pending") &&
                                    <>
                                        {authUser.role == "user" ? <p  onClick={() => UpdateOrder(order._id, "cancelled", order.pdfId, order.shopId)} className='whitespace-nowrap text-white md:text-sm text-xs bg-red-500 px-5 py-3 rounded-xl cursor-pointer'>Cancel Order</p> : <p  onClick={() => UpdateOrder(order._id, "completed", order.pdfId, order.userId)} className="whitespace-nowrap bg-green-500 px-5 py-3 rounded-xl text-white md:text-sm text-xs cursor-pointer">Complete Order</p>}
                                        {authUser.role === "shop" && <p  onClick={() => UpdateOrder(order._id, "rejected", order.pdfId, order.userId)} className='whitespace-nowrap text-white md:text-sm text-xs bg-red-500 px-5 py-3 rounded-xl cursor-pointer'>Reject Order</p>}
                                    </>}
                                   
                            </div>
                            <p className="text-gray-700">Quantity: {order.quantity}</p>
                            <p className="text-gray-700">Type: {order.color === "white" ? "color" : order.color === "black" ? "Black & White" : "Not Mentioned"}</p>
                            <p className="text-gray-700">Sides: {order.sides ?? "Not-Mentioned"}</p>
                        </div>
                        <div>
                            {/* <a href={order.pdfId[0]} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                View PDF
                            </a> */}
                            {order.pdfId.map((pdf, index) => (
                                <>
                                    {
                                        order.status === "pending" ? <div className='flex justify-between w-full'>
                                        <a key={index} href={pdf} target="_blank" rel="noopener noreferrer" className="whitespace-nowrap text-blue-500 hover:underline block">
                                            View Document {index + 1}
                                        </a>
                                        {authUser.role === "shop" && <p className='hover:underline hover:text-blue-500 text-black cursor-pointer'>Print</p>}
                                    </div> : null
                                    }
                                </>

                            ))}
                        </div>
                    </div>
                ))}
            </div>
                    </>
                    }
        </div>
    );
};

export default Dashboard;