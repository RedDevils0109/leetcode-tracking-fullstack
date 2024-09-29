import axios from "axios";
import api from "./normalApi"; // Ensure this points to your refresh token endpoint

const authApi = axios.create({
  baseURL: "http://localhost:5000", // Change this to your server URL
  withCredentials: true,
});

// Add a request interceptor to include the access token in headers
authApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // Adjust if you're using context instead
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// Add a response interceptor to handle 401 Unauthorized and 403 Forbidden errors
authApi.interceptors.response.use(
  (response) => response, // Return response if successful
  async (error) => {
    const originalRequest = error.config;

    // Log the error for debugging
    console.log("Error Details:", error);

    // Check if the response status is 401 (Unauthorized)
    if (error.response && error.response.status === 401) {
      // If this is the first retry for this request
      if (!originalRequest._retry) {
        originalRequest._retry = true;

        // Check if the error message indicates an expired access token
        if (error.response.data.message === "Access token expired") {
          try {
            console.log("Expired token found");
            // Attempt to refresh the access token
            const refreshResponse = await api.post("/auth/refresh-token"); // Ensure this is the correct path

            const { token } = refreshResponse.data; // Extract new access token
            console.log("New access token:", token);
            localStorage.setItem("token", token); // Store new access token

            // Update Authorization header with the new token
            originalRequest.headers["Authorization"] = `Bearer ${token}`;

            // Retry the original request with the new token
            return authApi(originalRequest);
          } catch (refreshError) {
            // Log refresh token error for debugging
            console.error("Error refreshing token:", refreshError);
            localStorage.removeItem("token"); // Clear the invalid token

            // Redirect to sign-in
            window.location.href = "/sign-in";
            return Promise.reject(refreshError); // Reject the promise to handle in the component
          }
        } else {
          // Log if it's a 401 error unrelated to token expiration
          console.error(
            "401 error not related to token expiry:",
            error.response.data
          );

          localStorage.removeItem("token"); // Clear the invalid token

          // Redirect to root path ("/")
          window.location.href = "/sign-in";
        }
      }
    } else if (error.response && error.response.status === 403) {
      // Handle 403 Forbidden errors: log them, but do not block the request
      console.warn("403 Forbidden error:", error.response.data);
      // Continue processing, but you can choose not to throw an error
       return Promise.reject(error);
    } else {
      localStorage.removeItem("token"); // Clear the invalid token

      // Redirect to root path ("/")
      window.location.href = "/sign-in";
    }

    return Promise.reject(error); // Reject the error if it's not handled
  }
);

export default authApi;
