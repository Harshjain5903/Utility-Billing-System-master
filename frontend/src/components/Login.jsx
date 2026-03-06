import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FiLogIn } from "react-icons/fi";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { baseApiURL } from "../baseUrl";
const Login = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState("User");
  const { register, handleSubmit, formState: { errors } } = useForm();
  
  const onSubmit = (data) => {
    // Validate login ID
    if (!data.loginid || data.loginid.trim() === "") {
      toast.error("Login ID is required");
      return;
    }
    
    // Validate password
    if (!data.password || data.password.length < 4) {
      toast.error("Password must be at least 4 characters");
      return;
    }
    const headers = {
      "Content-Type": "application/json",
    };
    // Ensure loginid is sent as a number
    const payload = { ...data, loginid: Number(data.loginid) };
    axios
      .post(`${baseApiURL()}/${selected.toLowerCase()}/auth/login`, payload, {
        headers: headers,
      })
      .then((response) => {
        navigate(`/${selected.toLowerCase()}`, {
          state: { type: selected, loginid: response.data.loginid },
        });
      })
      .catch((error) => {
        toast.dismiss();
        console.error(error);
        toast.error(error.response?.data?.message || "Login failed");
      });
  };
  return (
    <div className="bg-white h-[100vh] w-full flex justify-between items-center">
       <img
      className="w-[130vh] h-[150vh] object-contain"
      src="/UtiliityImage.png"
      alt="Utility"
    />
      <div className="w-[40%] flex justify-center items-start flex-col pl-8">
        <p className="text-3xl font-semibold pb-2 border-b-2 border-green-500">
          {selected && selected} Login
        </p>
        <form
          className="flex justify-center items-start flex-col w-full mt-10"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex flex-col w-[70%]">
            <label className="mb-1" htmlFor="eno">
              {selected && selected} Login ID
            </label>
            <input
              type="number"
              id="eno"
              required
              className="bg-white outline-none border-2 border-gray-400 py-2 px-4 rounded-md w-full focus:border-blue-500"
              {...register("loginid", { 
                required: "Login ID is required",
                min: { value: 1, message: "Login ID must be a positive number" }
              })}
            />
            {errors.loginid && (
              <span className="text-red-500 text-sm mt-1">{errors.loginid.message}</span>
            )}
          </div>
          <div className="flex flex-col w-[70%] mt-3">
            <label className="mb-1" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              required
              className="bg-white outline-none border-2 border-gray-400 py-2 px-4 rounded-md w-full focus:border-blue-500"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 4, message: "Password must be at least 4 characters" }
              })}
            />
            {errors.password && (
              <span className="text-red-500 text-sm mt-1">{errors.password.message}</span>
            )}
          </div>
          {/* <div className="flex w-[70%] mt-3 justify-start items-center">
            <input type="checkbox" id="remember" className="accent-blue-500" />{" "}
            Remember Me
          </div> */}
          <button className="bg-blue-500 mt-5 text-white px-6 py-2 text-xl rounded-md hover:bg-blue-700 ease-linear duration-300 hover:ease-linear hover:duration-300 hover:transition-all transition-all flex justify-center items-center">
            Login
            <span className="ml-2">
              <FiLogIn />
            </span>
          </button>
        </form>
      </div>
      <div className="absolute top-4 right-4">
        <button
          className={`text-blue-500 mr-6 text-base font-semibold hover:text-blue-700 ease-linear duration-300 hover:ease-linear hover:duration-300 hover:transition-all transition-all ${
            selected === "User" && "border-b-2 border-green-500"
          }`}
          onClick={() => setSelected("User")}
        >
          User
        </button>
        <button
          className={`text-blue-500 mr-6 text-base font-semibold hover:text-blue-700 ease-linear duration-300 hover:ease-linear hover:duration-300 hover:transition-all transition-all ${
            selected === "Employee" && "border-b-2 border-green-500"
          }`}
          onClick={() => setSelected("Employee")}
        >
          Employee
        </button>
        <button
          className={`text-blue-500 mr-6 text-base font-semibold hover:text-blue-700 ease-linear duration-300 hover:ease-linear hover:duration-300 hover:transition-all transition-all ${
            selected === "Admin" && "border-b-2 border-green-500"
          }`}
          onClick={() => setSelected("Admin")}
        >
          Admin
        </button>
      </div>
      <Toaster position="bottom-center" />
    </div>
  );
};

export default Login;