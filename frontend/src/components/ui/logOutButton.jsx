import { Button } from "@/components/ui/button";

export default function LogOutButton({ setIsAuthenticated, navigate }) {
  const handleLogout = () => {
    localStorage.removeItem('accessToken'); 
    localStorage.removeItem('refreshToken');
    setIsAuthenticated(false); 
    navigate('/auth'); 
  };

  return (
    <Button
      variant="outline"
      className="inline-flex items-center space-x-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
      onClick={handleLogout} // Attach the onClick event handler
    >
      <LogOutIcon className="h-4 w-4" />
      <span>Log Out</span>
    </Button>
  );
}

// LogOutIcon component
function LogOutIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" x2="9" y1="12" y2="12" />
    </svg>
  );
}
