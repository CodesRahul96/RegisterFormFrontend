import { useState, useEffect, useMemo, useCallback, Component } from "react";
import { useForm } from "react-hook-form";
import Select from "react-select";
import { Link } from "react-router-dom";
import { fetchCountries, fetchStates, fetchCities } from "../services/api";

// Error Boundary Component
class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-red-600 text-center">
          Something went wrong: {this.state.error?.message || "Unknown error"}
        </div>
      );
    }
    return this.props.children;
  }
}

const RegisterForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({ defaultValues: { country: "", state: "", city: "" } });

  // State management
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [profilePicPreview, setProfilePicPreview] = useState(null);
  const [isLoading, setIsLoading] = useState({
    countries: false,
    states: false,
    cities: false,
  });
  const [error, setError] = useState(null);

  // Watch form values for validation
  const countryValue = watch("country");
  const stateValue = watch("state");
  const cityValue = watch("city");

  // Fetch countries
  useEffect(() => {
    const loadCountries = async () => {
      setIsLoading((prev) => ({ ...prev, countries: true }));
      setError(null);
      try {
        const data = await fetchCountries();
        setCountries(data);
      } catch (err) {
        setError("Failed to load countries");
      }
      setIsLoading((prev) => ({ ...prev, countries: false }));
    };
    loadCountries();
  }, []);

  // Fetch states when country changes
  useEffect(() => {
    const loadStates = async () => {
      if (!selectedCountry?.value) {
        console.log("No country selected, resetting states and cities");
        setStates([]);
        setCities([]);
        setSelectedState(null);
        setSelectedCity(null);
        setValue("state", "");
        setValue("city", "");
        return;
      }

      console.log("Fetching states for country:", selectedCountry.value);
      setIsLoading((prev) => ({ ...prev, states: true }));
      setError(null);
      try {
        const data = await fetchStates(selectedCountry.value);
        setStates(data);
        setCities([]);
        setSelectedState(null);
        setSelectedCity(null);
        setValue("state", "");
        setValue("city", "");
        if (!data.length) {
          setError(`No states available for ${selectedCountry.label}`);
        }
      } catch (err) {
        setError("Failed to load states");
      }
      setIsLoading((prev) => ({ ...prev, states: false }));
    };
    loadStates();
  }, [selectedCountry, setValue]);

  // Fetch cities when state changes
  useEffect(() => {
    const loadCities = async () => {
      if (!selectedCountry?.value || !selectedState?.value) {
        console.log("No country or state selected, resetting cities");
        setCities([]);
        setSelectedCity(null);
        setValue("city", "");
        return;
      }

      console.log(
        "Fetching cities for country:",
        selectedCountry.value,
        "state:",
        selectedState.value
      );
      setIsLoading((prev) => ({ ...prev, cities: true }));
      setError(null);
      try {
        const data = await fetchCities(
          selectedCountry.value,
          selectedState.value
        );
        setCities(data);

        setSelectedCity(null);
        setValue("city", "");
        if (!data.length) {
          setError(`No cities available for ${selectedState.label}`);
        }
      } catch (err) {
        setError("Failed to load cities");
      }
      setIsLoading((prev) => ({ ...prev, cities: false }));
    };
    loadCities();
  }, [selectedCountry, selectedState, setValue]);

  // Handle dropdown changes
  const handleCountryChange = useCallback(
    (option) => {
      console.log("Country selected:", option);
      setSelectedCountry(option);
      setValue("country", option?.value || "", { shouldValidate: true });
    },
    [setValue]
  );

  const handleStateChange = useCallback(
    (option) => {
      console.log("State selected:", option);
      setSelectedState(option);
      setValue("state", option?.value || "", { shouldValidate: true });
    },
    [setValue]
  );

  const handleCityChange = useCallback(
    (option) => {
      console.log("City selected:", option);
      setSelectedCity(option);
      setValue("city", option?.value || "", { shouldValidate: true });
    },
    [setValue]
  );

  // Memoized dropdown options
  const countryOptions = useMemo(
    () => countries.map((c) => ({ value: c.code, label: c.name })),
    [countries]
  );
  const stateOptions = useMemo(
    () => states.map((s) => ({ value: s.code, label: s.name })),
    [states]
  );
  const cityOptions = useMemo(
    () => cities.map((c) => ({ value: c.name, label: c.name })),
    [cities]
  );

  // Handle profile picture
  const handleProfilePicChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicPreview(URL.createObjectURL(file));
    }
  }, []);

  // Form submission
  const onSubmit = useCallback((data) => {
    console.log("Form Data:", data);
    // Handle submission (e.g., send to backend)
  }, []);

  return (
    <ErrorBoundary>
      <div className="max-w-lg w-full bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Register
        </h2>
        {error && <p className="text-red-600 text-center mb-4">{error}</p>}
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
              <p className="mt-1 text-sm text-red-600">
                {errors.email.message}
              </p>
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
              <p className="mt-1 text-sm text-red-600">
                {errors.mobile.message}
              </p>
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
              <p className="mt-1 text-sm text-red-600">
                {errors.gender.message}
              </p>
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
            <Select
              id="country"
              options={countryOptions}
              value={selectedCountry}
              onChange={handleCountryChange}
              isLoading={isLoading.countries}
              isDisabled={isLoading.countries}
              placeholder="Select Country"
              className="mt-1"
              aria-invalid={errors.country ? "true" : "false"}
              aria-label="Select Country"
            />
            {errors.country && (
              <p className="mt-1 text-sm text-red-600">
                {errors.country.message}
              </p>
            )}
            {!errors.country && !countryValue && (
              <p className="mt-1 text-sm text-red-600">Country is required</p>
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
            <Select
              id="state"
              options={stateOptions}
              value={selectedState}
              onChange={handleStateChange}
              isLoading={isLoading.states}
              isDisabled={
                !selectedCountry ||
                isLoading.states ||
                stateOptions.length === 0
              }
              placeholder="Select State"
              className="mt-1"
              aria-invalid={errors.state ? "true" : "false"}
              aria-label="Select State"
            />
            {errors.state && (
              <p className="mt-1 text-sm text-red-600">
                {errors.state.message}
              </p>
            )}
            {!errors.state &&
              selectedCountry &&
              !stateValue &&
              states.length > 0 && (
                <p className="mt-1 text-sm text-red-600">State is required</p>
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
            <Select
              id="city"
              options={cityOptions}
              value={selectedCity}
              onChange={handleCityChange}
              isLoading={isLoading.cities}
              isDisabled={
                !selectedState || isLoading.cities || cityOptions.length === 0
              }
              placeholder="Select City"
              className="mt-1"
              aria-invalid={errors.city ? "true" : "false"}
              aria-label="Select City"
            />
            {errors.city && (
              <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
            )}
            {!errors.city &&
              selectedState &&
              !cityValue &&
              cities.length > 0 && (
                <p className="mt-1 text-sm text-red-600">City is required</p>
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
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Login
          </Link>
        </p>
      </div>
    </ErrorBoundary>
  );
};

export default RegisterForm;
