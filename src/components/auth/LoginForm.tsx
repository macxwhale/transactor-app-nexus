
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export const LoginForm = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the new auth page
    navigate("/auth");
  }, [navigate]);

  // Show nothing while redirecting
  return null;
};
