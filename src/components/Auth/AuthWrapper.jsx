const AuthWrapper = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 flex items-center justify-center p-4">
      {children}
    </div>
  );
};

export default AuthWrapper;
