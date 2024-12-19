
export const Orders = () => {
    return (
        <div>
            <h1 className="text-2xl font-bold mb-5">Orders</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-gray-800 p-4 rounded-lg">
                    <h2 className="text-xl font-bold mb-2">Order 1</h2>
                    <p className="text-gray-400 mb-2">Order Date: 2021-10-10</p>
                    <p className="text-gray-400 mb-2">Status: Pending</p>
                    <p className="text-gray-400 mb-2">Quantity: 2</p>
                    <button className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-3 py-1">
                        View
                    </button>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg">
                    <h2 className="text-xl font-bold mb-2">Order 2</h2>
                    <p className="text-gray-400 mb-2">Order Date: 2021-10-10</p>
                    <p className="text-gray-400 mb-2">Status: Pending</p>
                    <p className="text-gray-400 mb-2">Quantity: 2</p>
                    <button className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-3 py-1">
                        View
                    </button>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg">
                    <h2 className="text-xl font-bold mb-2">Order 3</h2>
                    <p className="text-gray-400 mb-2">Order Date: 2021-10-10</p>
                    <p className="text-gray-400 mb-2">Status: Pending</p>
                    <p className="text-gray-400 mb-2">Quantity: 2</p>
                    <button className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-3 py-1">
                        View
                    </button>
                </div>
            </div>
        </div>
    );
}