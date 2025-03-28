// import { useState } from "react";
// import { Link } from "react-router-dom";
// import useLogin from "../../hooks/useLogin";

// const Login = () => {
// 	const [username, setUsername] = useState("");
// 	const [password, setPassword] = useState("");

// 	const { loading, login } = useLogin();

// 	const handleSubmit = async (e) => {
// 		e.preventDefault();
// 		await login(username, password);
// 	};

// 	return (
// 		<div className='flex flex-col items-center justify-center min-w-96 mx-auto'>
// 			<div className='w-full p-6 rounded-lg shadow-md bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0'>
// 				<h1 className='text-3xl font-semibold text-center text-gray-300'>
// 					Login
// 					<span className='text-blue-500'> PrintOnGo</span>
// 				</h1>

// 				<form onSubmit={handleSubmit}>
// 					<div>
// 						<label className='label p-2'>
// 							<span className='text-base label-text'>Username</span>
// 						</label>
// 						<input
// 							type='text'
// 							placeholder='Enter username'
// 							className='w-full input input-bordered h-10'
// 							value={username}
// 							onChange={(e) => setUsername(e.target.value)}
// 						/>
// 					</div>

// 					<div>
// 						<label className='label'>
// 							<span className='text-base label-text'>Password</span>
// 						</label>
// 						<input
// 							type='password'
// 							placeholder='Enter Password'
// 							className='w-full input input-bordered h-10'
// 							value={password}
// 							onChange={(e) => setPassword(e.target.value)}
// 						/>
// 					</div>
// 					<Link to='/signup' className='text-sm  hover:underline hover:text-blue-600 mt-2 inline-block'>
// 						{"Don't"} have an account?
// 					</Link>

// 					<div>
// 						<button className='btn btn-block btn-sm mt-2' disabled={loading}>
// 							{loading ? <span className='loading loading-spinner '></span> : "Login"}
// 						</button>
// 					</div>
// 				</form>
// 			</div>
// 		</div>
// 	);
// };
// export default Login;

// STARTER CODE FOR THIS FILE
// const Login = () => {
// 	return (
// 		<div className='flex flex-col items-center justify-center min-w-96 mx-auto'>
// 			<div className='w-full p-6 rounded-lg shadow-md bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0'>
// 				<h1 className='text-3xl font-semibold text-center text-gray-300'>
// 					Login
// 					<span className='text-blue-500'> PrintOnGo</span>
// 				</h1>

// 				<form>
// 					<div>
// 						<label className='label p-2'>
// 							<span className='text-base label-text'>Username</span>
// 						</label>
// 						<input type='text' placeholder='Enter username' className='w-full input input-bordered h-10' />
// 					</div>

// 					<div>
// 						<label className='label'>
// 							<span className='text-base label-text'>Password</span>
// 						</label>
// 						<input
// 							type='password'
// 							placeholder='Enter Password'
// 							className='w-full input input-bordered h-10'
// 						/>
// 					</div>
// 					<a href='#' className='text-sm  hover:underline hover:text-blue-600 mt-2 inline-block'>
// 						{"Don't"} have an account?
// 					</a>

// 					<div>
// 						<button className='btn btn-block btn-sm mt-2'>Login</button>
// 					</div>
// 				</form>
// 			</div>
// 		</div>
// 	);
// };
// export default Login;


import { useState } from "react";
import { Link } from "react-router-dom";
import useLogin from "../../hooks/useLogin";
import bgimage from "../../assets/loginImg.jpeg";

const Login = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const { loading, login } = useLogin();

	const handleSubmit = async (e) => {
		e.preventDefault();
		await login(username, password);
	};

	return (
		<div
  className="min-h-screen w-full bg-cover bg-center flex items-center justify-center"
  style={{ backgroundImage: `url(${bgimage})`,backgroungSize:"cover",backgroundRepeat:"no-repeat",backgroundPosition:"center" }}
>
		<div className='flex flex-col items-center justify-center shadow-xl min-w-96 mx-auto'  >
			<div className='w-full p-6 rounded-lg shadow-md bg-white border border-gray-300'>
				<h1 className='text-3xl font-semibold text-center text-gray-700'>
					Login
					<span className='text-blue-500'> PrintOnGo</span>
				</h1>

				<form onSubmit={handleSubmit}>
					<div>
						<label className='label p-2'>
							<span className='text-base label-text text-gray-700'>Username</span>
						</label>
						<input
							type='text'
							placeholder='Enter username'
							className='w-full input input-bordered !bg-gray-100 h-10 border-gray-300'
							value={username}
							onChange={(e) => setUsername(e.target.value)}
						/>
					</div>

					<div>
						<label className='label'>
							<span className='text-base label-text  text-gray-700'>Password</span>
						</label>
						<input
							type='password'
							placeholder='Enter Password'
							className='w-full input input-bordered !bg-gray-100 h-10 border-gray-300'
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
					</div>
					<Link to='/signup' className='text-sm text-blue-600 hover:underline mt-2 inline-block'>
						{"Don't"} have an account?
					</Link>

					<div>
						<button className='btn btn-block btn-sm mt-2 bg-blue-500 text-white hover:bg-blue-600' disabled={loading}>
							{loading ? <span className='loading loading-spinner '></span> : "Login"}
						</button>
					</div>
				</form>
			</div>
		</div>
		</div>
	);
};
export default Login;

