import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../components/context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  
  const { singup, isAuthenticated, errors: registerErrors } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate("/projects");
  }, [isAuthenticated]);

  const onSubmit = handleSubmit(async (values) => {
    await singup(values);
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-900">
      <div className="bg-zinc-800 max-w-md w-full p-10 rounded-md">
        {registerErrors.map((error, i) => (
          <div key={i} className="bg-red-500 p-2 mb-2 rounded text-white">
            {error}
          </div>
        ))}
        <h1 className="text-2xl font-bold text-white mb-4">Registrarse</h1>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            {...register("username", { required: true })}
            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md mb-2"
            placeholder="Nombre de usuario"
          />
          {errors.username && (
            <p className="text-red-500 text-sm mb-2">
              El usuario es requerido
            </p>
          )}

          <input
            type="text"
            {...register("email", { required: true })}
            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md mb-2"
            placeholder="Ingrese su email"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mb-2">El mail es requerido</p>
          )}

          <input
            type="password"
            {...register("password", { required: true })}
            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md mb-2"
            placeholder="Ingrese su contraseña"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mb-2">
              La contraseña es requerida
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-sky-600 hover:bg-sky-700 text-white py-2 px-4 rounded mt-2"
          >
            Registrar
          </button>
        </form>

        <p className="text-gray-300 mt-4 text-sm text-center">
          ¿Ya tienes una cuenta?{" "}
          <Link to="/login" className="text-sky-400 hover:underline">
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
