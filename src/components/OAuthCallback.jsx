import { useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const OAuthCallback = () => {
  const { provider } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleCallback = async () => {
      const query = new URLSearchParams(location.search);
      const code = query.get("code");
      const state = query.get("state");

      if (!code) {
        console.error("No authorization code received");
        navigate("/login", { state: { error: "Authentication failed" } });
        return;
      }

      try {
        // Placeholder for backend API call to exchange code for access token
        const response = await axios.post(`/api/auth/${provider}/callback`, {
          code,
          state,
        });

        // In a real app, the backend would return user data or a session token
        console.log(`Received token for ${provider}:, response.data`);
        navigate("/dashboard"); // Redirect to a protected route
      } catch (error) {
        console.error(`Error exchanging code for ${provider}:, error`);
        navigate("/login", { state: { error: "Authentication failed" } });
      }
    };

    handleCallback();
  }, [provider, location, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-gray-600">Processing {provider} login...</p>
    </div>
  );
};

export default OAuthCallback;
