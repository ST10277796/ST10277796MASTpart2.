import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10 flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl md:text-7xl font-serif font-bold text-primary mb-4">
          404
        </h1>
        <p className="text-xl md:text-2xl text-foreground mb-2">
          Page Not Found
        </p>
        <p className="text-muted-foreground mb-8">
          The page you're looking for doesn't exist.
        </p>
        <button
          onClick={() => navigate(user ? "/" : "/login")}
          className="px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-all"
        >
          {user ? "Return to Dashboard" : "Return to Login"}
        </button>
      </div>
    </div>
  );
};

export default NotFound;
