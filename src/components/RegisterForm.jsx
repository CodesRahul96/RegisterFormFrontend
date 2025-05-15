import { useState } from "react";
import { useForm } from "react-hook-form";

const RegisterForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Dummy data for country, state, city
  const countries = ["USA", "India", "Canada"];
  const states = {
    USA: ["California", "Texas", "Florida"],
    India: ["Maharashtra", "Gujrat", "Delhi", "Karnataka"],
    Canada: ["Ontario", "Quebec", "British Columbia"],
  };
  const cities = {
    California: ["Los Angeles", "San Francisco"],
    Texas: ["Houston", "Austin"],
    Florida: ["Miami", "Orlando"],
    Maharashtra: [
      "Mumbai",
      "Pune",
      "Nashik",
      "Nagpur",
      "Aurangabad",
      "Thane",
      "Solapur",
      "Kolhapur",
      "Jalna",
      "Akola",
    ],
    Gujrat: [
      "Surat",
      "Ahmedabad",
      "Vadodara",
      "Rajkot",
      "Bhavnagar",
      "Jamnagar",
      "Gandhinagar",
    ],
    Delhi: ["New Delhi", "Old Delhi"],
    Karnataka: ["Bangalore", "Mysore"],
    Ontario: ["Toronto", "Ottawa"],
    Quebec: ["Montreal", "Quebec City"],
    "British Columbia": ["Vancouver", "Victoria"],
  };

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [profilePicPreview, setProfilePicPreview] = useState(null);

  // Handle profile picture preview
  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicPreview(URL.createObjectURL(file));
    }
  };

  // Handle form submission
  const onSubmit = (data) => {
    console.log("Form Data:", data);
    // Handle form submission (e.g., send to API)
  };

  return (
    <div className="max-w-lg w-full bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Register
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Name */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Name
          </label>
          <input
            id="name"
            type="text"
            {...register("name", {
              required: "Name is required",
              minLength: {
                value: 2,
                message: "Name must be at least 2 characters",
              },
            })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Invalid email address",
              },
            })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Mobile */}
        <div>
          <label
            htmlFor="mobile"
            className="block text-sm font-medium text-gray-700"
          >
            Mobile
          </label>
          <input
            id="mobile"
            type="tel"
            {...register("mobile", {
              required: "Mobile number is required",
              pattern: {
                value: /^[0-9]{10}$/,
                message: "Invalid mobile number (10 digits required)",
              },
            })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.mobile && (
            <p className="mt-1 text-sm text-red-600">{errors.mobile.message}</p>
          )}
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Gender
          </label>
          <div className="mt-2 flex space-x-4">
            {["Male", "Female", "Other"].map((gender) => (
              <label key={gender} className="flex items-center">
                <input
                  type="radio"
                  value={gender.toLowerCase()}
                  {...register("gender", { required: "Gender is required" })}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-600">{gender}</span>
              </label>
            ))}
          </div>
          {errors.gender && (
            <p className="mt-1 text-sm text-red-600">{errors.gender.message}</p>
          )}
        </div>

        {/* Hobbies */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Hobbies
          </label>
          <div className="mt-2 flex flex-wrap gap-4">
            {["Reading", "Traveling", "Gaming", "Cooking"].map((hobby) => (
              <label key={hobby} className="flex items-center">
                <input
                  type="checkbox"
                  value={hobby.toLowerCase()}
                  {...register("hobbies", {
                    required: "Select at least one hobby",
                  })}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-600">{hobby}</span>
              </label>
            ))}
          </div>
          {errors.hobbies && (
            <p className="mt-1 text-sm text-red-600">
              {errors.hobbies.message}
            </p>
          )}
        </div>

        {/* Profile Picture */}
        <div>
          <label
            htmlFor="profilePic"
            className="block text-sm font-medium text-gray-700"
          >
            Profile Picture
          </label>
          <input
            id="profilePic"
            type="file"
            accept="image/*"
            {...register("profilePic", {
              required: "Profile picture is required",
            })}
            onChange={handleProfilePicChange}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
          {errors.profilePic && (
            <p className="mt-1 text-sm text-red-600">
              {errors.profilePic.message}
            </p>
          )}
          {profilePicPreview && (
            <img
              src={profilePicPreview}
              alt="Profile Preview"
              className="mt-2 h-24 w-24 rounded-full object-cover"
            />
          )}
        </div>

        {/* Country */}
        <div>
          <label
            htmlFor="country"
            className="block text-sm font-medium text-gray-700"
          >
            Country
          </label>
          <select
            id="country"
            {...register("country", { required: "Country is required" })}
            onChange={(e) => {
              setSelectedCountry(e.target.value);
              setSelectedState("");
            }}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Select Country</option>
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
          {errors.country && (
            <p className="mt-1 text-sm text-red-600">
              {errors.country.message}
            </p>
          )}
        </div>

        {/* State */}
        <div>
          <label
            htmlFor="state"
            className="block text-sm font-medium text-gray-700"
          >
            State
          </label>
          <select
            id="state"
            {...register("state", { required: "State is required" })}
            onChange={(e) => setSelectedState(e.target.value)}
            disabled={!selectedCountry}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Select State</option>
            {selectedCountry &&
              states[selectedCountry]?.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
          </select>
          {errors.state && (
            <p className="mt-1 text-sm text-red-600">{errors.state.message}</p>
          )}
        </div>

        {/* City */}
        <div>
          <label
            htmlFor="city"
            className="block text-sm font-medium text-gray-700"
          >
            City
          </label>
          <select
            id="city"
            {...register("city", { required: "City is required" })}
            disabled={!selectedState}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Select City</option>
            {selectedState &&
              cities[selectedState]?.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
          </select>
          {errors.city && (
            <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
          )}
        </div>

        {/* File Attachments */}
        <div>
          <label
            htmlFor="attachments"
            className="block text-sm font-medium text-gray-700"
          >
            File Attachments
          </label>
          <input
            id="attachments"
            type="file"
            multiple
            {...register("attachments")}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
