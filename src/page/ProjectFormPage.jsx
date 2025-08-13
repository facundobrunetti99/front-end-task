import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useProject } from '../components/context/ProjectContext';
import { useAuth } from '../components/context/AuthContext';

function ProjectFormPage() {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const { createProject, getProject, updateProject } = useProject();
  const { isAuthenticated, loading: authLoading, authChecked, user} = useAuth();
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    reset(); // Limpiar completamente el formulario
  }, [user, reset]);
  // Redirigir si no está autenticado después de verificar
  useEffect(() => {
    if (authChecked && !isAuthenticated) {
      navigate('/login');
    }
  }, [authChecked, isAuthenticated, navigate]);

  useEffect(() => {
    async function loadProject() {
      if (params.id && isAuthenticated && !authLoading) {
        try {
          setLoading(true);
          setErrorMessage("");
          
          const project = await getProject(params.id);
          
          if (project) {
            setValue('title', project.title);
            setValue('description', project.description);
          } else {
            setErrorMessage("Proyecto no encontrado");
            // Opcional: redirigir después de unos segundos
            setTimeout(() => navigate('/projects'), 3000);
          }
        } catch (error) {
          console.error("Error cargando proyecto:", error);
          if (error.response?.status === 401) {
            setErrorMessage("No tienes permisos para acceder a este proyecto");
          } else if (error.response?.status === 404) {
            setErrorMessage("Proyecto no encontrado");
          } else {
            setErrorMessage("Error al cargar el proyecto");
          }
        } finally {
          setLoading(false);
        }
      }
    }
    loadProject();
  }, [params.id, isAuthenticated, authLoading, setValue, getProject, navigate]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      setLoading(true);
      setErrorMessage("");
      setSuccessMessage("");
      
      if (params.id) {
        await updateProject(params.id, data);
        setSuccessMessage("✅ Proyecto actualizado con éxito");
      } else {
        await createProject(data);
        setSuccessMessage("✅ Proyecto creado con éxito");
      }
      
      // Redirigir a la lista de proyectos después de 2 segundos
      setTimeout(() => {
        navigate('/projects');
      }, 2000);
      
    } catch (error) {
      console.error("Error en onSubmit:", error);
      if (error.response?.status === 401) {
        setErrorMessage("No tienes permisos para realizar esta acción");
      } else if (error.response?.status === 400) {
        setErrorMessage("Datos inválidos. Verifica la información ingresada");
      } else {
        setErrorMessage("Error al guardar el proyecto");
      }
    } finally {
      setLoading(false);
    }
  });

  // Mostrar loading mientras se verifica la autenticación
  if (authLoading || !authChecked) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="text-white">Verificando autenticación...</div>
      </div>
    );
  }

  // Si no está autenticado, no mostrar nada (ya se redirigió)
  if (!isAuthenticated) {
    return null;
  }

  // Mostrar loading durante operaciones
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="text-white">
          {params.id ? "Cargando proyecto..." : "Cargando..."}
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 p-4">
      <div className="bg-zinc-800 max-w-md w-full p-8 rounded-lg shadow-lg">
        <h2 className="text-white text-2xl font-bold mb-6 text-center">
          {params.id ? "Editar Proyecto" : "Crear Nuevo Proyecto"}
        </h2>
        
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div>
            <input
              type="text"
              placeholder="Título del proyecto"
              {...register("title", { 
                required: "El título es requerido",
                minLength: {
                  value: 3,
                  message: "El título debe tener al menos 3 caracteres"
                }
              })}
              className="bg-zinc-700 text-white px-4 py-3 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.title && (
              <p className="text-red-400 text-sm mt-1">{errors.title.message}</p>
            )}
          </div>

          <div>
            <textarea
              rows="4"
              placeholder="Descripción del proyecto (opcional)"
              {...register("description", {
                maxLength: {
                  value: 500,
                  message: "La descripción no puede exceder 500 caracteres"
                }
              })}
              className="bg-zinc-700 text-white px-4 py-3 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
            {errors.description && (
              <p className="text-red-400 text-sm mt-1">{errors.description.message}</p>
            )}
          </div>

          <button 
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading 
              ? (params.id ? "Actualizando..." : "Creando...")
              : (params.id ? "Actualizar Proyecto" : "Crear Proyecto")
            }
          </button>
        </form>

        {/* Mensajes de estado */}
        {successMessage && (
          <div className="text-green-400 font-medium mt-4 p-3 bg-green-900/20 rounded-md">
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="text-red-400 font-medium mt-4 p-3 bg-red-900/20 rounded-md">
            {errorMessage}
          </div>
        )}

        {/* Enlaces de navegación */}
        <div className="mt-6 flex justify-between">
          <Link 
            to="/projects" 
            className="text-blue-300 hover:text-blue-200 transition-colors"
          >
            ← Ver mis proyectos
          </Link>
          
          {params.id && (
            <Link 
              to={`/projects/${params.id}/epics`}
              className="text-green-300 hover:text-green-200 transition-colors"
            >
              Ver épicas →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProjectFormPage;
