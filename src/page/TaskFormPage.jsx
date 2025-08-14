import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTask } from "../components/context/TaskContext";
import { Link, useParams, useNavigate } from "react-router-dom";

function TaskFormPage() {
  const { register, handleSubmit, setValue } = useForm();
  const { createTask, getTask, updateTask } = useTask();
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { projectId, epicId, storyId, id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function loadTask() {
      if (id && projectId && epicId && storyId) {
        try {
          setLoading(true);
          const task = await getTask(projectId, epicId, storyId, id);
          if (task) {
            setValue("title", task.title);
            setValue("description", task.description);
          } else {
            setErrorMessage("Tarea no encontrada");
          }
        } catch (error) {
          console.error("Error cargando tarea:", error);
          setErrorMessage("Error al cargar la tarea");
        } finally {
          setLoading(false);
        }
      }
    }
    loadTask();
  }, [id, projectId, epicId, storyId, setValue, getTask, navigate]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      setLoading(true);
      setErrorMessage("");
      if (id) {
        await updateTask(projectId, epicId, storyId, id, data);
        setSuccessMessage("✅ Tarea actualizada con éxito");
        setTimeout(() => {
          reset({
            title: "",
            description: ""
          });
        }, 1500); 
      } else {
        await createTask(projectId, epicId, storyId, data);
        setSuccessMessage("✅ Tarea creada con éxito");
        setTimeout(() => {
          reset({
            title: "",
            description: ""
          });
        }, 1500); 
      }
    } catch (error) {
      console.error("Error en onSubmit:", error);
      setErrorMessage("Error al guardar la tarea");
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
        <h2 className="text-2xl font-bold text-white mb-4 text-center">
          {id ? "Editar Tarea" : "Crear Tarea"}
        </h2>

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
          />

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

        <div className="flex flex-col gap-2 mt-4">
          <Link
            to={`/projects/${projectId}/epics/${epicId}/stories/${storyId}/tasks`}
            className="text-blue-300 hover:underline text-center"
          >
            Ver Tareas
          </Link>
          <Link
            to={`/projects/${projectId}/epics/${epicId}/stories/${storyId}/task`}
            className="text-green-300 hover:underline text-center"
          >
            Crear Nueva Tarea
          </Link>
          <Link
            to={`/projects/${projectId}/epics/${epicId}/stories`}
            className="text-purple-300 hover:underline text-center"
          >
            ← Volver a Historias
          </Link>
        </div>
      </div>
    </div>
  );
}

export default TaskFormPage;
