import { useState } from "react";
import { BsSend, BsPaperclip, BsX, BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import useSendMessage from "../../hooks/useSendMessage";
import { storage } from "../../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";
import { use } from "react";
import useConversation from "../../zustand/useConversation";
import { useAuthContext } from "../../context/AuthContext";
import { IoMdAdd, IoMdAddCircle } from "react-icons/io";

const MessageInput = () => {
  const [message, setMessage] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const {selectedConversation} = useConversation();
  const { authUser } = useAuthContext();
  const [printOptions, setPrintOptions] = useState({
    paperSize: "A4",
    copies: 1,
    sides: 1,
    color: "black",
  });

  const { loading, sendMessage } = useSendMessage();

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const filePreviews = files.map((file) => ({
      file,
      preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : null,
      textContent: null,
    }));

    filePreviews.forEach((item, index) => {
      if (item.file.type === "text/plain") {
        const reader = new FileReader();
        reader.onload = () => {
          filePreviews[index].textContent = reader.result;
          setUploadedFiles([...filePreviews]);
        };
        reader.readAsText(item.file);
      }
    });

    setUploadedFiles(filePreviews);
    setShowPopup(true);
    setCurrentIndex(0);
  };

  const handlePrintOptionsChange = (e) => {
    const { name, value } = e.target;
    setPrintOptions((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message) return;
    await sendMessage(message);
    setMessage("");
  };

  const handleFileSubmit = async () => {
    const uploadedFileData = []; // Array to store file metadata

    try {
        // Iterate over the files and upload to Firebase Storage
        for (const fileObj of uploadedFiles) {
            const file = fileObj.file; // Extract the file object
            const fileRef = ref(storage, `files/${file.name}-${v4()}`); // Create unique file path in Firebase

            // Upload file to Firebase
            const snapshot = await uploadBytes(fileRef, file);
            const downloadURL = await getDownloadURL(snapshot.ref);

            // Add file metadata to the array
            uploadedFileData.push({
                file_url: downloadURL,
                paper_size: printOptions.paperSize,
                copies: printOptions.copies,
                sides: printOptions.sides,
                color: printOptions.color,
            });
        }

        // Send the uploaded file metadata to the server
        const response = await fetch('/api/files/upload', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(uploadedFileData),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Files uploaded successfully to the server:', result.map((item) => item.file_url));

        if (result) {
          const body = {
              userId: authUser._id,
              pdfId: [], // Initialize pdfId as an empty array
              quantity: 0,
              shopId: selectedConversation._id,
              sides: printOptions.sides,
                color: printOptions.color,
          };
      
          // Map file URLs to strings and assign to pdfId
          body.pdfId = result.map((item) => item.file_url.toString());
      
          // Set the quantity
          body.quantity = printOptions.copies;
          console.log('Order body:', body);
      
          // Send a message indicating files have been uploaded
          await sendMessage('ThisIsAFileCode' + JSON.stringify(result));
      
          const response = await fetch('/api/users/order', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(body), // Ensure body is a JSON string
          });
      
          console.log('Order created successfully:', response);
      }
      
    } catch (error) {
        console.error('Error uploading files:', error);
    }
};

  

  const closePopup = () => {
    setShowPopup(false);
    setUploadedFiles([]);
  };

  const navigatePreview = (direction) => {
    if (direction === "prev") {
      setCurrentIndex((prev) => (prev === 0 ? uploadedFiles.length - 1 : prev - 1));
    } else {
      setCurrentIndex((prev) => (prev === uploadedFiles.length - 1 ? 0 : prev + 1));
    }
  };

  return (
    <>
      <form className="px-4 my-3" onSubmit={handleSubmit}>
        <div className="w-full relative">
          <input
            type="text"
            className="border text-sm rounded-lg block w-full p-2.5 pr-20 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Send a message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <div className="absolute inset-y-0 end-0 flex items-center pe-3 gap-3">
            <label
              htmlFor="file-upload"
              className="flex items-center justify-center cursor-pointer text-gray-400 hover:text-blue-500"
            >
              
              {/* <BsPaperclip className="text-lg" /> */}
              <IoMdAddCircle  /> 
              <input
                id="file-upload"
                type="file"
                multiple
                className="hidden"
                onChange={handleFileChange}
              />
            </label>

            <button
              type="submit"
              className="flex items-center justify-center text-gray-400 hover:text-blue-500"
            >
              {loading ? (
                <div className="loading loading-spinner"></div>
              ) : (
                <BsSend className="text-lg" />
              )}
            </button>
          </div>
        </div>
      </form>

      {showPopup && uploadedFiles.length > 0 && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-800 z-50 text-white rounded-lg p-5 w-96">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">File Options</h3>
              <button
                onClick={closePopup}
                className="text-gray-400 hover:text-red-500"
              >
                <BsX className="text-xl" />
              </button>
            </div>

            <div className="mt-4">
              <p className="text-sm mb-2 truncate">
                <strong>File:</strong> {uploadedFiles[currentIndex].file.name}
              </p>

              <div className="mb-4 h-[30vh] overflow-auto border border-gray-600 rounded-lg bg-gray-700">
                {uploadedFiles[currentIndex].file.type.startsWith("image/") ? (
                  <img
                    src={uploadedFiles[currentIndex].preview}
                    alt="Preview"
                    className="w-full h-auto rounded-t-lg"
                  />
                ) : uploadedFiles[currentIndex].file.type === "application/pdf" ? (
					<Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">

                    <Viewer
                      fileUrl={URL.createObjectURL(uploadedFiles[currentIndex].file)}
                      className="w-full h-[28vh]"
                    />
                  </Worker>
                ) : uploadedFiles[currentIndex].textContent ? (
                  <textarea
                    value={uploadedFiles[currentIndex].textContent}
                    readOnly
                    className="w-full h-[28vh] bg-gray-700 border-none text-white p-2"
                  />
                ) : (
                  <p className="text-sm text-gray-400 p-2">
                    No preview available for this file type.
                  </p>
                )}
              </div>

              {uploadedFiles.length > 1 && (
                <div className="flex justify-between mb-4">
                  <button
                    onClick={() => navigatePreview("prev")}
                    className="bg-gray-700 hover:bg-gray-600 text-white rounded-lg px-3 py-1"
                  >
                    <BsChevronLeft />
                  </button>
                  <button
                    onClick={() => navigatePreview("next")}
                    className="bg-gray-700 hover:bg-gray-600 text-white rounded-lg px-3 py-1"
                  >
                    <BsChevronRight />
                  </button>
                </div>
              )}

              <div className="mb-4">
                <label className="block text-sm mb-1">Paper Size</label>
                <select
                  name="paperSize"
                  value={printOptions.paperSize}
                  onChange={handlePrintOptionsChange}
                  className="block w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
                >
                  <option value="A4">A4</option>
                  <option value="A3">A3</option>
                  <option value="Letter">Letter</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm mb-1">Type</label>
                <select
                  name="color"
                  defaultValue={printOptions.color}
                  onChange={handlePrintOptionsChange}
                  className="block w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
                >
                  <option value="black">Black and White</option>
                  <option value="white">Color</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm mb-1">Sides</label>
                <select
                  name="paperSize"
                  defaultValue={printOptions.sides}
                  onChange={handlePrintOptionsChange}
                  className="block w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
                >
                  <option value="1">1</option>
                  <option value="2">2</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm mb-1">Number of Copies</label>
                <input
                  type="number"
                  name="copies"
                  defaultValue={printOptions.copies}
                  min="1"
                  onChange={handlePrintOptionsChange}
                  className="block w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
                />
              </div>

              <button
                onClick={() => {
                  alert(
                    `Printing ${printOptions.copies} copies on ${printOptions.paperSize} paper.`
                  );
                  closePopup();
                  handleFileSubmit();
                }}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-lg py-2"
              >
                Create Print Order
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MessageInput;
