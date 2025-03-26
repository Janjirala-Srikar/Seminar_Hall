import React from "react";
import ReactDOM from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!clerkPubKey) {
  throw new Error("Missing Clerk publishable key");
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <ClerkProvider publishableKey={clerkPubKey} signUpUrl="/signup" signInUrl="/">
    <App />
  </ClerkProvider>
);
