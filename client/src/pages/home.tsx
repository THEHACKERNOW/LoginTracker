import { useEffect } from "react";
import { useLocation } from "wouter";

export default function Home() {
  const [_, setLocation] = useLocation();

  useEffect(() => {
    // Redirect to login page as this is a login application
    setLocation("/login");
  }, [setLocation]);

  return null;
}
