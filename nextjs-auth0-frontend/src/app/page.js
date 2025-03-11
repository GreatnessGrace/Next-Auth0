"use client"; // Mark as Client Component

import { useUser } from "@auth0/nextjs-auth0";
import axios from "axios";

export default function Home() {
  const { user, error, isLoading } = useUser();

  console.log("User:", user); // Debugging
  console.log("Error:", error); // Debugging
  console.log("Loading:", isLoading); // Debugging

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  const sendTokenToBackend = async (token) => {
    try {
      await axios.post("http://localhost:3001/auth/callback", { token });
      alert("Token sent to backend successfully!");
    } catch (err) {
      console.error("Failed to send token to backend:", err);
    }
  };

  if (user) {
    sendTokenToBackend(user.accessToken);
    return (
      <div>
        <h1>Welcome, {user.name}!</h1>
        <a href="/api/auth/logout">Logout</a>
      </div>
    );
  }

  return <a href="/api/auth/login">Login</a>;
}
