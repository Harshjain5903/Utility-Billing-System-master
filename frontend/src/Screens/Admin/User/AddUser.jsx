import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { baseApiURL } from "../../../baseUrl";
import { FiUpload } from "react-icons/fi";

const AddUser = () => {
  const [file, setFile] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [categoryList, setCategoryList] = useState([]);

  const [data, setData] = useState({
    enrollmentNo: "",
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    enrollmentYear: "",
    category: "",
    gender: "",
  });

  const getCategoryData = async () => {
    try {
      const res = await axios.get(`${baseApiURL()}/category/getCategory`, {
        headers: { "Content-Type": "application/json" },
      });

      if (res.data.success) {
        setCategoryList(res.data.categories || []);
      } else {
        toast.error(res.data.message || "Failed to load categories");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load categories");
    }
  };

  useEffect(() => {
    getCategoryData();
  }, []);

  // cleanup preview URL
  useEffect(() => {
    return () => {
      if (previewImage) URL.revokeObjectURL(previewImage);
    };
  }, [previewImage]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.type?.startsWith("image/")) {
      toast.error("Please select an image file only");
      return;
    }

    if (previewImage) URL.revokeObjectURL(previewImage);

    setFile(selectedFile);
    setPreviewImage(URL.createObjectURL(selectedFile));
  };

  const addUserProfile = async (e) => {
    e.preventDefault();

    // basic validations to avoid backend 500
    if (!data.enrollmentNo) return toast.error("User Id is required");
    if (!data.firstName) return toast.error("First Name is required");
    if (!data.lastName) return toast.error("Last Name is required");
    if (!data.email) return toast.error("Email is required");
    if (!data.phoneNumber) return toast.error("Phone Number is required");
    if (!data.enrollmentYear) return toast.error("Enrollment Year is required");
    if (!data.category) return toast.error("Category is required");
    if (!data.gender) return toast.error("Gender is required");
    if (!file) return toast.error("Profile pic is required");

    const loadingId = toast.loading("Adding User...");

    try {
      const formData = new FormData();

      // ✅ send both keys (some backends use userId, some use enrollmentNo)
      formData.append("enrollmentNo", data.enrollmentNo);
      formData.append("userId", data.enrollmentNo);

      formData.append("firstName", data.firstName);
      formData.append("middleName", data.middleName);
      formData.append("lastName", data.lastName);
      formData.append("email", data.email);
      formData.append("phoneNumber", data.phoneNumber);
      formData.append("enrollmentYear", data.enrollmentYear);
      formData.append("category", data.category);
      formData.append("gender", data.gender);

      // keeps your existing backend logic
      formData.append("type", "profile");

      // ✅ must match upload.single("profile")
      formData.append("profile", file);

      // ✅ DO NOT set multipart header manually (axios sets correct boundary)
      const res1 = await axios.post(
        `${baseApiURL()}/user/details/addDetails`,
        formData
      );

      if (!res1.data.success) {
        toast.dismiss(loadingId);
        return toast.error(res1.data.message || "Failed to add user details");
      }

      // Register user credentials (loginid/password)
      const res2 = await axios.post(`${baseApiURL()}/user/auth/register`, {
        loginid: data.enrollmentNo,
        password: data.enrollmentNo,
      });

      toast.dismiss(loadingId);

      if (!res2.data.success) {
        return toast.error(res2.data.message || "User registration failed");
      }

      toast.success("User added successfully");

      // reset
      setFile(null);
      if (previewImage) URL.revokeObjectURL(previewImage);
      setPreviewImage("");

      setData({
        enrollmentNo: "",
        firstName: "",
        middleName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        enrollmentYear: "",
        category: "",
        gender: "",
      });
    } catch (err) {
      toast.dismiss(loadingId);
      console.error(err);
      toast.error(err?.response?.data?.message || "Internal Server Error");
    }
  };

  return (
    <form
      onSubmit={addUserProfile}
      className="w-[70%] flex justify-center items-center flex-wrap gap-6 mx-auto mt-10"
    >
      <div className="w-[40%]">
        <label htmlFor="firstname" className="leading-7 text-sm ">
          First Name
        </label>
        <input
          type="text"
          id="firstname"
          value={data.firstName}
          onChange={(e) => setData({ ...data, firstName: e.target.value })}
          className="w-full bg-blue-50 rounded border focus:border-dark-green focus:bg-secondary-light focus:ring-2 focus:ring-light-green text-base outline-none py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
        />
      </div>

      <div className="w-[40%]">
        <label htmlFor="middlename" className="leading-7 text-sm ">
          Middle Name
        </label>
        <input
          type="text"
          id="middlename"
          value={data.middleName}
          onChange={(e) => setData({ ...data, middleName: e.target.value })}
          className="w-full bg-blue-50 rounded border focus:border-dark-green focus:bg-secondary-light focus:ring-2 focus:ring-light-green text-base outline-none py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
        />
      </div>

      <div className="w-[40%]">
        <label htmlFor="lastname" className="leading-7 text-sm ">
          Last Name
        </label>
        <input
          type="text"
          id="lastname"
          value={data.lastName}
          onChange={(e) => setData({ ...data, lastName: e.target.value })}
          className="w-full bg-blue-50 rounded border focus:border-dark-green focus:bg-secondary-light focus:ring-2 focus:ring-light-green text-base outline-none py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
        />
      </div>

      <div className="w-[40%]">
        <label htmlFor="enrollmentNo" className="leading-7 text-sm ">
          User Id
        </label>
        <input
          type="number"
          id="enrollmentNo"
          value={data.enrollmentNo}
          onChange={(e) => setData({ ...data, enrollmentNo: e.target.value })}
          className="w-full bg-blue-50 rounded border focus:border-dark-green focus:bg-secondary-light focus:ring-2 focus:ring-light-green text-base outline-none py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
        />
      </div>

      <div className="w-[40%]">
        <label htmlFor="email" className="leading-7 text-sm ">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          value={data.email}
          onChange={(e) => setData({ ...data, email: e.target.value })}
          className="w-full bg-blue-50 rounded border focus:border-dark-green focus:bg-secondary-light focus:ring-2 focus:ring-light-green text-base outline-none py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
        />
      </div>

      <div className="w-[40%]">
        <label htmlFor="phoneNumber" className="leading-7 text-sm ">
          Phone Number
        </label>
        <input
          type="number"
          id="phoneNumber"
          value={data.phoneNumber}
          onChange={(e) => setData({ ...data, phoneNumber: e.target.value })}
          className="w-full bg-blue-50 rounded border focus:border-dark-green focus:bg-secondary-light focus:ring-2 focus:ring-light-green text-base outline-none py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
        />
      </div>

      <div className="w-[40%]">
        <label htmlFor="enrollmentYear" className="leading-7 text-sm ">
          Enrollment Year
        </label>
        <input
          type="number"
          id="enrollmentYear"
          value={data.enrollmentYear}
          onChange={(e) => setData({ ...data, enrollmentYear: e.target.value })}
          className="w-full bg-blue-50 rounded border focus:border-dark-green focus:bg-secondary-light focus:ring-2 focus:ring-light-green text-base outline-none py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
        />
      </div>

      <div className="w-[40%]">
        <label htmlFor="category" className="leading-7 text-sm ">
          Category
        </label>
        <select
          id="category"
          className="px-2 bg-blue-50 py-3 rounded-sm text-base w-full accent-blue-700 mt-1"
          value={data.category}
          onChange={(e) => setData({ ...data, category: e.target.value })}
        >
          <option value="">-- Select --</option>
          {categoryList?.map((c) => (
            <option value={c.name} key={c.name}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="w-[40%]">
        <label htmlFor="gender" className="leading-7 text-sm ">
          Gender
        </label>
        <select
          id="gender"
          className="px-2 bg-blue-50 py-3 rounded-sm text-base w-full accent-blue-700 mt-1"
          value={data.gender}
          onChange={(e) => setData({ ...data, gender: e.target.value })}
        >
          <option value="">-- Select --</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="w-[40%]">
        <label htmlFor="file" className="leading-7 text-sm ">
          Profile Pic
        </label>

        <label
          htmlFor="file"
          className="px-2 bg-blue-50 py-3 rounded-sm text-base w-full flex justify-center items-center cursor-pointer"
        >
          Upload <span className="ml-2"><FiUpload /></span>
        </label>

        <input
          hidden
          type="file"
          id="file"
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>

      {previewImage && (
        <div className="w-full flex justify-center items-center">
          <img src={previewImage} alt="user" className="h-36" />
        </div>
      )}

      <button
        type="submit"
        className="bg-blue-500 px-6 py-3 rounded-sm mb-6 text-white"
      >
        Add New User
      </button>
    </form>
  );
};

export default AddUser;
