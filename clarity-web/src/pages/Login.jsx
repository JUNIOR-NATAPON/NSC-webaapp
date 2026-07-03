import { FaEnvelope, FaLock, FaEyeSlash, FaGoogle } from "react-icons/fa";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Login() {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8">

        <div className="flex flex-col items-center">

          <img
            src={logo}
            className="w-24 h-24 object-contain"
            alt="logo"
          />

          <h1 className="text-4xl font-bold text-blue-600 mt-2">
            Clarity
          </h1>

        </div>

        <div className="mt-8 space-y-5">

          <div className="relative">

            <FaEnvelope className="absolute left-4 top-4 text-gray-400"/>

            <input
              type="email"
              placeholder="Email"
              className="w-full rounded-full bg-gray-100 py-3 pl-12 border border-gray-200 outline-none focus:border-blue-500"
            />

          </div>

          <div className="relative">

            <FaLock className="absolute left-4 top-4 text-gray-400"/>

            <input
              type="password"
              placeholder="Password"
              className="w-full rounded-full bg-gray-100 py-3 pl-12 pr-12 border border-gray-200 outline-none focus:border-blue-500"
            />

            <FaEyeSlash className="absolute right-4 top-4 text-gray-400 cursor-pointer"/>

          </div>

          <button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-full py-3 transition"
          >
            Sign In
          </button>

          <div className="flex items-center">

            <div className="flex-1 h-px bg-gray-300"/>

            <span className="mx-4 text-gray-500">
              OR
            </span>

            <div className="flex-1 h-px bg-gray-300"/>

          </div>

          <button
            className="w-full border rounded-full py-3 flex items-center justify-center gap-3 hover:bg-gray-50 transition"
          >

            <FaGoogle/>

            Continue with Google

          </button>

          <p className="text-center text-gray-500">

            Don't have an account?

            <Link
              to="/signup"
              className="text-blue-600 ml-1 font-semibold"
            >
              Sign Up
            </Link>

          </p>

        </div>

      </div>

    </div>
  );
}