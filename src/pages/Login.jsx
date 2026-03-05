import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/userService";
import { useAuth } from "../contexts/AuthContext";
import { Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    if (!email.trim() || !password) {
      setServerError("Todos los campos son obligatorios");
      return;
    }

    setIsLoading(true);
    try {
      const user = loginUser({ email, password });
      login(user);
      navigate("/dashboard");
    } catch (error) {
      setServerError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col items-center justify-center px-4 py-10">
      {/* Logo + Título */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-20 h-20 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200 mb-5 rotate-3 hover:rotate-0 transition-transform duration-300">
          <span className="text-white text-3xl font-black tracking-tight">
            IP
          </span>
        </div>
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">
          InventarioPro
        </h1>
        <p className="text-gray-400 text-sm mt-2">
          Gestión de inventario para pequeños negocios
        </p>
      </div>

      {/* Card */}
      <div className="bg-white w-full max-w-md rounded-3xl shadow-xl shadow-gray-200/80 p-8 border border-gray-100">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Bienvenido de nuevo
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            Ingresa tus credenciales para continuar
          </p>
        </div>

        {/* Error */}
        {serverError && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-2xl mb-5">
            <AlertCircle size={16} className="flex-shrink-0" />
            <span>{serverError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="correo@ejemplo.com"
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl border-2 border-gray-200 
                           text-sm text-gray-900 placeholder:text-gray-300
                           focus:outline-none focus:border-indigo-500 focus:ring-4 
                           focus:ring-indigo-100 transition-all duration-200
                           hover:border-gray-300"
              />
            </div>
          </div>

          {/* Contraseña */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Contraseña
            </label>
            <div className="relative">
              <Lock
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-12 py-3.5 rounded-2xl border-2 border-gray-200 
                           text-sm text-gray-900 placeholder:text-gray-300
                           focus:outline-none focus:border-indigo-500 focus:ring-4 
                           focus:ring-indigo-100 transition-all duration-200
                           hover:border-gray-300"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 
                           hover:text-indigo-500 transition-colors"
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>

          {/* Botón */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 active:scale-95
                       text-white font-bold py-3.5 rounded-2xl mt-2
                       transition-all duración-200 shadow-lg shadow-indigo-200
                       disabled:opacity-60 disabled:cursor-not-allowed
                       flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
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
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
                Ingresando...
              </>
            ) : (
              "Iniciar Sesión"
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-gray-100" />
          <span className="text-xs text-gray-400">¿No tienes cuenta?</span>
          <div className="flex-1 h-px bg-gray-100" />
        </div>

        <Link
          to="/register"
          className="block w-full text-center py-3 rounded-2xl border-2 
                     border-indigo-200 text-indigo-600 font-semibold text-sm
                     hover:bg-indigo-50 hover:border-indigo-400 transition-all duration-200"
        >
          Crear cuenta gratis
        </Link>
      </div>

      {/* Footer */}
      <p className="text-xs text-gray-300 mt-8">
        InventarioPro © {new Date().getFullYear()}
      </p>
    </div>
  );
}