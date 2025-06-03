import { useState } from "react";
import { FiEye, FiEyeOff, FiMail, FiLock, FiUser } from "react-icons/fi";

const Input = ({
  type = "text",
  placeholder,
  value,
  onChange,
  icon,
  error,
  ...props
}) => {
  const [showPassword] = useState(false);

  const Icon = () => {
    switch (icon) {
      case "email":
        return <FiMail className="text-blue-400" />;
      case "password":
        return <FiLock className="text-blue-400" />;
      case "user":
        return <FiUser className="text-blue-400" />;
      default:
        return null;
    }
  };

  return (
    <div className="mb-5 ">
      <div className="relative ">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon />
          </div>
        )}
        <input
          type={type === "password" && showPassword ? "text" : type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`w-full py-3 px-4 ${
            icon ? "pl-10" : "pl-4"
          } pr-10 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-black placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${
            error ? "border-red-500" : "border-white/20"
          }`}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-400 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
