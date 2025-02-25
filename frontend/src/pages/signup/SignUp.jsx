import { Link } from "react-router-dom";
import { useState } from "react";
import { storage } from "../../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";
import useSignup from "../../hooks/useSignup";
import { OpenStreetMapAutocomplete } from "@amraneze/osm-autocomplete";
import "./wrapper.css";
import { set } from "mongoose";
import bgimage from "../../assets/loginImg.jpeg";

const SignUp = () => {
    const [inputs, setInputs] = useState({
        fullName: "",
        username: "",
        password: "",
        confirmPassword: "",
        role: "user",
        profilePic: null,
        latitude: null,
        longitude: null,
        address: "",
    });

    const { loading, signup } = useSignup();

    


    const handleLocationFetch = async () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setInputs({
                        ...inputs,
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                },
                (error) => {
                    console.error("Error fetching location: ", error);
                    alert("Unable to fetch location. Please check location permissions.");
                }
            );
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    };
    const handleOnOptionSelected = (field, option) => {
        console.log(field, { option: option });
        // setInputs({ ...inputs, address: option.display_name || option.name });
        // setInputs({ ...inputs, latitude: option.lat });
        // setInputs({ ...inputs, longitude: option.lon });
        setInputs({
            ...inputs,
            address: option.display_name || option.name,
            latitude: option.lat,
            longitude: option.lon,
        });

      };
      
    const handleRoleChange = (e) => {
        setInputs({ ...inputs, role: e.target.value });
    };

    const allForms = document.querySelectorAll("form");
    allForms.forEach((form) => {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
        });
    });


    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const fileRef = ref(storage, `files/${file.name}-${v4()}`); // Create unique file path in Firebase

            try {
                const snapshot = await uploadBytes(fileRef, file); // Upload file to Firebase
                const downloadURL = await getDownloadURL(snapshot.ref); // Get download URL

                setInputs({ ...inputs, profilePic: downloadURL }); // Update profilePic state with Firebase URL

            } catch (error) {
                console.error("Error uploading file:", error);
                alert("Error uploading file. Please try again.");
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

        if(inputs.fullName.length <6){
            alert("Full Name must be at least 6 characters long");
            return;
        }

        if(inputs.username.length <6){
            alert("Username must be at least 6 characters long");
            return;
        }


        if(inputs.address === "") {
            alert("Please enter an address");
            return;
        }

        if (!inputs.profilePic) {
            alert("Please upload a profile picture");
            return;
        }

        if(inputs.password !== inputs.confirmPassword){
            alert("Passwords do not match");
            return;
        }

        if (!passwordPattern.test(inputs.password)) {
            alert("Password must be at least 8 characters long, start with a capital letter, and contain at least one digit and one special character.");
            return;
        }


        
        console.log(inputs);  // Debug log here
        await signup(inputs);
    };

    return (
        <div  className="min-h-screen w-full bg-cover bg-center flex items-center justify-center"
          style={{ backgroundImage: `url(${bgimage})`,backgroungSize:"cover",backgroundRepeat:"no-repeat",backgroundPosition:"center" }}>
        <div className="flex flex-col bg-white rounded-xl items-center justify-center min-w-96  mx-auto">
            <div className="w-full p-6 rounded-lg  bg-gray-400 h-[90vh] overflow-y-auto no-scrollbar shadow-xl bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0">
                <h1 className="text-3xl font-semibold text-center text-black">
                    Sign Up <span className="text-blue-500"> PrintOnGo</span>
                </h1>

                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <div>
                        <label className="label p-2">
                            <span className="text-base label-text">Full Name</span>
                        </label>
                        <input
                            type="text"
                            placeholder="John Doe"
                            className="w-full input !bg-gray-100  input-bordered h-10"
                            value={inputs.fullName}
                            onChange={(e) => setInputs({ ...inputs, fullName: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="label p-2">
                            <span className="text-base label-text">Username</span>
                        </label>
                        <input
                            type="text"
                            placeholder="johndoe"
                            className="w-full input !bg-gray-100  input-bordered h-10"
                            value={inputs.username}
                            onChange={(e) => setInputs({ ...inputs, username: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="label">
                            <span className="text-base label-text">Password</span>
                        </label>
                        <input
                            type="password"
                            placeholder="Enter Password"
                            className="w-full input !bg-gray-100  input-bordered h-10"
                            value={inputs.password}
                            onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="label">
                            <span className="text-base label-text">Confirm Password</span>
                        </label>
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            className="w-full input !bg-gray-100  input-bordered h-10"
                            value={inputs.confirmPassword}
                            onChange={(e) => setInputs({ ...inputs, confirmPassword: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="label p-2">
                            <span className="text-base label-text">Role</span>
                        </label>
                        <select
                            className="w-full select !bg-gray-100 select-bordered h-10"
                            value={inputs.role}
                            onChange={handleRoleChange}
                        >
                            <option value="user">User</option>
                            <option value="shop">Shop</option>
                        </select>
                    </div>

                    {/* <div className="mt-2">
                        <button
                            type="button"
                            className="btn btn-sm border border-slate-700"
                            onClick={handleLocationFetch}
                        >
                            Fetch Location
                        </button>
                        {inputs.latitude && inputs.longitude && (
                            <p className="text-xs text-gray-400 mt-1">
                                Location: {inputs.latitude}, {inputs.longitude}
                            </p>
                        )}
                    </div> */}
                    <label className="label p-2">
                        <span className="text-base label-text">Address</span>
                    </label>
                    <OpenStreetMapAutocomplete
                    className="md:w-full lg:w-full "
        value={null}
        onChange={(option) => handleOnOptionSelected("First component", option)}
        // onpressEnter={(option) => handleOnOptionSelected("First component", option)}
      />
                    <div className="mt-2 ">
                        <label className="label p-2">
                            <span className="text-base  label-text">Profile Picture</span>
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            className="w-full file-input !bg-gray-100 text-black file-input-bordered h-10"
                            onChange={handleFileChange}
                            required="true"
                        />
                    </div>

                    <Link
                        to={"/login"}
                        className="text-sm hover:underline hover:text-blue-600 mt-2 inline-block"
                    >
                        Already have an account?
                    </Link>

                    <div>
                        <button className="btn btn-block btn-sm mt-2 border  border-slate-700" disabled={loading}>
                            {loading ? <span className="loading loading-spinner"></span> : "Sign Up"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
        </div>
    );
};

export default SignUp;
