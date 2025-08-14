import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useProject } from "../components/context/ProjectContext";
function ProjectFormPage() {
  const { register, handleSubmit, setValue,reset } = useForm();
  const { createProject, getProject, updateProject } = useProject();
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const navigate = useNavigate();
  const projectId=params.id;

  useEffect(() => {
    async function loadProject() {
      if (projectId) {
        try {
          setLoading(true);
          const project = await getProject(projectId);

          if (project) {
            setValue("title", project.title);
            setValue("description", project.description);
          } else {
            setErrorMessage("Proyecto no encontrado");
          }
        } catch (error) {
          console.error("Error cargando proyecto:", error);
          setErrorMessage("Error al cargar el proyecto");
        } finally {
          setLoading(false);
        }
      }
    }
    loadProject();
  }, [projectId]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      setLoading(true);
      setErrorMessage("");
      if (projectId) {
        await updateProject(projectId, data);
        setSuccessMessage("✅ Proyecto actualizado con éxito");
           //Limpiar form después de actualizar
        reset({
          title: "",
          description: ""
        });
      } else {
        await createProject(data);
        setSuccessMessage("✅ Proyecto creado con éxito");
        reset({
          title: "",
          description: ""
        });
      }
    } catch (error) {
      console.error("Error en onSubmit:", error);
      setErrorMessage("Error al guardar el proyecto");
    } finally {
      setLoading(false);
    }
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="text-white">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <div className="bg-zinc-800 max-w-md w-full p-10 rounded-md flex flex-col gap-2">
        <form onSubmit={onSubmit} className="flex flex-col gap-2">
          <input
            type="text"
            placeholder="Título"
            {...register("title", { required: "El título es requerido" })}
            className="bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
          />
          <textarea
            rows="3"
            placeholder="Descripción"
            {...register("description")}
            className="bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
          ></textarea>

          <button
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Guardando..." : "Guardar"}
          </button>
        </form>

        {successMessage && (
          <div className="text-green-400 font-medium mt-2">
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="text-red-400 font-medium mt-2">{errorMessage}</div>
        )}

        <Link to="/projects" className="text-blue-300 mt-4 hover:underline">
          Mostrar Proyectos
        </Link>
      </div>
    </div>
  );
}

export default ProjectFormPage;
