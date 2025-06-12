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
    <div className="mb-2 ">
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
          className={`w-full py-2 px-3 ${
            icon ? "pl-10" : "pl-4"
          } pr-10 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-black placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${
            error ? "border-red-500" : "border-white/20"
          }`}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-400 flex items-center">{error}</p>
      )}
    </div>
  );
};

export default Input;
