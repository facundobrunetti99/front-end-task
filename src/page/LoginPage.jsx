import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../components/context/AuthContext";
import { useNavigate, useLocation, Link } from "react-router-dom";

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { singin, isAuthenticated, errors: singinErrors } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/projects";

  useEffect(() => {
    if (isAuthenticated) navigate(from, { replace: true });
  }, [isAuthenticated]);

  const onSubmit = handleSubmit(async (data) => {
    await singin(data);
  });

  return (
    <div className="flex h-[calc(100vh-100px)] items-center justify-center">
      <div className="bg-zinc-800 max-w-md w-full p-10 rounded-md my-2">
        {Array.isArray(singinErrors) &&
          singinErrors.map((error, i) => (
            <div key={i} className="bg-red-500 p-2">
              {error}
            </div>
          ))}

        <h1 className="text-2xl font-bold">Iniciar Sesión</h1>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            {...register("email", { required: true })}
            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
            placeholder="Ingrese su email"
          />
          {errors.email && <p className="text-red-500">El mail es requerido</p>}

          <input
            type="password"
            {...register("password", { required: true })}
            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
            placeholder="Ingrese su contraseña"
          />
          {errors.password && (
            <p className="text-red-500">La contraseña es requerida</p>
          )}

          <button type="submit">Iniciar sesión</button>
        </form>
        <p className="flex gap-x-2 justify-between">
          ¿No tienes una cuenta?
          <Link to="/register" className="text-sky-200">
            Registrarse
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
