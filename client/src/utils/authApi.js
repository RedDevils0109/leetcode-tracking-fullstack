import axios from "axios";

const authApi = axios.create({
  baseURL: "http://localhost:5000", // Change this to your server URL
});

// Add a request interceptor to include the access token in headers
authApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle 401 errors (Unauthorized)
authApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if it's a 401 error (Unauthorized)
    if (error.response && error.response.status === 401) {
      // If the original request hasn't been retried yet
      if (!originalRequest._retry) {
        originalRequest._retry = true;

        // Check if the error message indicates an expired access token
        if (error.response.data.message === "Access token expired") {
          try {
            // Attempt to refresh the access token
            const refreshResponse = await axios.post(
              "http://localhost:5000/api/auth/refresh-token",
              null,
              { withCredentials: true }
            );

            const { token } = refreshResponse.data; // Fixing the variable name
            localStorage.setItem("token", token);

            // Update the Authorization header in the original request
            originalRequest.headers["Authorization"] = `Bearer ${token}`;

            // Retry the original request with the new token
            return api(originalRequest);
          } catch (refreshError) {
            console.error(
              "Refresh token expired or invalid. Redirecting to login..."
            );
            // Handle the case where the refresh token is also expired or invalid
            localStorage.removeItem("token"); // Clear access token
            window.location.href = "/sign-in"; // Redirect to login page
          }
        } else {
          // If it's another 401 error (not related to token expiry), clear the token and redirect to login
          localStorage.removeItem("token");
          window.location.href = "/sign-in";
        }
      }
    }

    return Promise.reject(error);
  }
);

export default authApi;
