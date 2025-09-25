// src/pages/Login.jsx
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
	const navigate = useNavigate();
	const { register, handleSubmit, formState: { errors } } = useForm();

	const onSubmit = (data) => {
		axios
			.post("http://localhost:3000/api/auth/login", { email: data.email, password: data.password })
			.then(() => navigate("/home"))
			.catch((err) => console.log(err));
	};

	return (
		<div className="mx-auto max-w-xl w-full">
			<div className="text-center mt-8 sm:mt-10">
				<div className="mx-auto h-10 w-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-semibold">G</div>
				<h1 className="mt-6 text-3xl font-semibold">Log in to your account</h1>
			</div>

			<div className="mt-8 sm:mt-10">
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
					<div>
						<label htmlFor="email" className="block text-sm font-medium">Email</label>
						<input
							id="email"
							type="email"
							placeholder="you@example.com"
							{...register("email", { required: "This field is required" })}
							className={`mt-1 w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-neutral-900 ${errors.email ? "border-red-500" : "border-gray-300"}`}
						/>
						{errors.email && (
							<p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
						)}
					</div>

					<div>
						<label htmlFor="password" className="block text-sm font-medium">Password</label>
						<input
							id="password"
							type="password"
							placeholder="********"
							{...register("password", { required: "Password is required", minLength: { value: 1, message: "At least 8 characters" } })}
							className={`mt-1 w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-neutral-900 ${errors.password ? "border-red-500" : "border-gray-300"}`}
						/>
						{errors.password && (
							<p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
						)}
					</div>

					<div className="flex justify-end">
						<a href="#" className="text-sm text-emerald-600 hover:underline">Forgot password?</a>
					</div>

					<button type="submit" className="w-full bg-emerald-600 text-white rounded-md py-2.5 hover:bg-emerald-700 transition">Continue</button>
				</form>

				<p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
					Are you new? <Link to="/register" className="text-emerald-600 hover:underline">Create an Account</Link>
				</p>
			</div>
		</div>
	);
}
