import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/userService";
import { useAuth } from "../contexts/AuthContext";
import { User, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react";

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [serverError, setServerError] = useState("");

  const validateName = (value) => {
    if (!value || value.trim().length < 3) {
      return "El nombre debe tener al menos 3 caracteres";
    }
    return "";
  };

  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return "Ingresa un email válido";
    }
    return "";
  };

  const validatePassword = (value) => {
    if (!value || value.length < 8) {
      return "Mínimo 8 caracteres, 1 mayúscula y 1 número";
    }
    if (!/[A-Z]/.test(value) || !/[0-9]/.test(value)) {
      return "Mínimo 8 caracteres, 1 mayúscula y 1 número";
    }
    return "";
  };

  const validateConfirmPassword = (value, pwd) => {
    if (value !== pwd) {
      return "Las contraseñas no coinciden";
    }
    return "";
  };

  const getPasswordStrength = (value) => {
    let score = 0;
    if (value.length >= 8) score += 1;
    if (/[A-Z]/.test(value)) score += 1;
    if (/[0-9]/.test(value)) score += 1;
    if (/[^A-Za-z0-9]/.test(value)) score += 1;
    return score;
  };

  const handleChange = (field, value) => {
    setServerError("");
    setErrors((prev) => ({ ...prev, [field]: "" }));

    if (field === "name") {
      setName(value);
      const err = validateName(value);
      if (err) setErrors((prev) => ({ ...prev, name: err }));
    }

    if (field === "email") {
      setEmail(value);
      const err = validateEmail(value);
      if (err) setErrors((prev) => ({ ...prev, email: err }));
    }

    if (field === "password") {
      setPassword(value);
      const err = validatePassword(value);
      const confirmErr = validateConfirmPassword(confirmPassword, value);
      setErrors((prev) => ({
        ...prev,
        password: err,
        confirmPassword: confirmErr || prev.confirmPassword,
      }));
    }

    if (field === "confirmPassword") {
      setConfirmPassword(value);
      const err = validateConfirmPassword(value, password);
      if (err) setErrors((prev) => ({ ...prev, confirmPassword: err }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    const nameErr = validateName(name);
    if (nameErr) newErrors.name = nameErr;

    const emailErr = validateEmail(email);
    if (emailErr) newErrors.email = emailErr;

    const pwdErr = validatePassword(password);
    if (pwdErr) newErrors.password = pwdErr;

    const confirmErr = validateConfirmPassword(confirmPassword, password);
    if (confirmErr) newErrors.confirmPassword = confirmErr;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    if (!name.trim()) {
      setServerError("El nombre es obligatorio");
      return;
    }
    if (!email.trim()) {
      setServerError("El email es obligatorio");
      return;
    }
    if (!password) {
      setServerError("La contraseña es obligatoria");
      return;
    }
    if (password !== confirmPassword) {
      setServerError("Las contraseñas no coinciden");
      return;
    }
    if (password.length < 6) {
      setServerError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setIsLoading(true);
    try {
      const newUser = registerUser({ name, email, password });
      login(newUser);
      navigate("/dashboard");
    } catch (error) {
      setServerError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = getPasswordStrength(password);

  const baseInputClasses =
    "block w-full rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200";

  const getInputClasses = (field) => {
    const hasError = !!errors[field];
    const hasValue =
      (field === "name" && name) ||
      (field === "email" && email) ||
      (field === "password" && password) ||
      (field === "confirmPassword" && confirmPassword);

    if (hasError) {
      return `${baseInputClasses} border-red-400 bg-red-50`;
    }
    if (hasValue) {
      return `${baseInputClasses} border-green-400 bg-green-50`;
    }
    return `${baseInputClasses} border-gray-300 bg-white`;
  };

  const renderValidIcon = (field) => {
    const hasError = !!errors[field];
    const valueMap = {
      name,
      email,
      password,
      confirmPassword,
    };
    const hasValue = valueMap[field];

    if (!hasError && hasValue) {
      return (
        <CheckCircle
          size={16}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-green-500"
        />
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start py-8 px-4 overflow-y-auto sm:py-10 sm:px-6">
      <div className="flex flex-col items-center mb-8 w-full max-w-md">
        <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center shadow-lg mb-4">
          <span className="text-white text-2xl font-bold">IP</span>
        </div>

        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          InventarioPro
        </h1>

        <p className="text-gray-500 text-base mt-2 text-center">
          Gestión de inventario para pequeños negocios
        </p>
      </div>

      <div className="bg-white w-full max-w-md rounded-2xl shadow-md p-8 mb-10">
        {serverError && (
          <div
            className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700 flex items-center gap-2"
            role="alert"
          >
            <AlertCircle size={16} className="flex-shrink-0" />
            <span>{serverError}</span>
          </div>
        )}

          <form onSubmit={handleSubmit}>
          {/* Nombre completo */}
          <div className="mb-5">
            <label
              htmlFor="name"
              className="block text-sm font-semibold text-gray-700 mb-1.5"
            >
              Nombre completo
            </label>
            <div className="relative">
              <User
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
              <input
                id="name"
                name="name"
                type="text"
                className={`${getInputClasses("name")} pl-10 pr-4 py-3 rounded-xl text-sm`}
                value={name}
                onChange={(e) => handleChange("name", e.target.value)}
              />
              {renderValidIcon("name")}
            </div>
            {errors.name && (
              <p
                className="text-red-500 text-xs mt-1.5 flex items-center gap-1"
                role="alert"
              >
                <AlertCircle size={12} />
                {errors.name}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="mb-5">
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-700 mb-1.5"
            >
              Email
            </label>
            <div className="relative">
              <Mail
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
              <input
                id="email"
                name="email"
                type="email"
                className={`${getInputClasses("email")} pl-10 pr-4 py-3 rounded-xl text-sm`}
                value={email}
                onChange={(e) => handleChange("email", e.target.value)}
              />
              {renderValidIcon("email")}
            </div>
            {errors.email && (
              <p
                className="text-red-500 text-xs mt-1.5 flex items-center gap-1"
                role="alert"
              >
                <AlertCircle size={12} />
                {errors.email}
              </p>
            )}
          </div>

          {/* Contraseña */}
          <div className="mb-5">
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-gray-700 mb-1.5"
            >
              Contraseña
            </label>
            <div className="relative">
              <Lock
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                className={`${getInputClasses(
                  "password"
                )} pl-10 pr-10 py-3 rounded-xl text-sm`}
                value={password}
                onChange={(e) => handleChange("password", e.target.value)}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm"
                onClick={() => setShowPassword((prev) => !prev)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              {renderValidIcon("password")}
            </div>
            {errors.password && (
              <p
                className="text-red-500 text-xs mt-1.5 flex items-center gap-1"
                role="alert"
              >
                <AlertCircle size={12} />
                {errors.password}
              </p>
            )}

            {/* Indicador de fortaleza de contraseña */}
            <div className="mt-2 mb-1">
              <div className="flex gap-1 h-1.5">
                {[1, 2, 3, 4].map((level) => {
                  let color = "bg-gray-200";
                  if (passwordStrength >= level) {
                    if (passwordStrength <= 1) color = "bg-red-400";
                    else if (passwordStrength === 2) color = "bg-orange-400";
                    else if (passwordStrength === 3) color = "bg-yellow-400";
                    else color = "bg-green-500";
                  }
                  return (
                    <div
                      key={level}
                      className={`flex-1 rounded-full ${color}`}
                    />
                  );
                })}
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {passwordStrength <= 1
                  ? "Muy débil"
                  : passwordStrength === 2
                  ? "Débil"
                  : passwordStrength === 3
                  ? "Buena"
                  : "Fuerte"}
              </p>
            </div>
          </div>

          {/* Confirmar contraseña */}
          <div className="mb-5">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-semibold text-gray-700 mb-1.5"
            >
              Confirmar contraseña
            </label>
            <div className="relative">
              <Lock
                size={18}
                className={`absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none
      ${
        confirmPassword && confirmPassword !== password
          ? "text-red-400"
          : confirmPassword && confirmPassword === password
          ? "text-green-400"
          : "text-gray-400"
      }`}
              />
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirm ? "text" : "password"}
                className={`${getInputClasses(
                  "confirmPassword"
                )} pl-10 pr-10 py-3 rounded-xl text-sm`}
                value={confirmPassword}
                onChange={(e) =>
                  handleChange("confirmPassword", e.target.value)
                }
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm"
                onClick={() => setShowConfirm((prev) => !prev)}
                tabIndex={-1}
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              {renderValidIcon("confirmPassword")}
            </div>
            {errors.confirmPassword && (
              <p
                className="text-red-500 text-xs mt-1.5 flex items-center gap-1"
                role="alert"
              >
                <AlertCircle size={12} />
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Botón Registrarse */}
          <div>
            {isLoading ? (
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-xl mt-2 flex items-center justify-center gap-2 opacity-80 cursor-not-allowed"
                disabled
              >
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
                Registrando...
              </button>
            ) : (
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold py-3 rounded-xl mt-2 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                Registrarse
              </button>
            )}
          </div>
        </form>

        {/* Link a login */}
        <p className="text-center text-sm text-gray-500 mt-5">
          ¿Ya tienes cuenta?{" "}
          <a
            href="/login"
            className="text-indigo-600 font-semibold hover:underline"
            onClick={(e) => {
              e.preventDefault();
              navigate("/login");
            }}
          >
            Iniciar sesión
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;

