import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useEpic } from '../components/context/EpicContext';

function EpicFormPage() {
  const { register, handleSubmit, setValue } = useForm();
  const { createEpic, getEpic, updateEpic } = useEpic();
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const params = useParams();

  const projectId = params.projectId;
  const epicId = params.id;


  useEffect(() => {
    async function loadEpic() {
     
      if (epicId && projectId) {
        try {
          setLoading(true);
          const epic = await getEpic(projectId, epicId);
          
          if (epic) {
            setValue('title', epic.title);
            setValue('description', epic.description);
          } else {
            setErrorMessage("Épica no encontrada");
            
          }
        } catch (error) {
          console.error("Error cargando épica:", error);
          setErrorMessage("Error al cargar la épica");
        } finally {
          setLoading(false);
        }
      } else if (epicId && !projectId) {
        setErrorMessage("Falta el ID del proyecto");
      }
      
    }
    loadEpic();
  }, [epicId, projectId, setValue, getEpic]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      setLoading(true);
      setErrorMessage("");
      
      if (epicId) {
        await updateEpic(projectId, epicId, data);
        setSuccessMessage("✅ Épica actualizada con éxito");
      } else {
        await createEpic(projectId, data);
        setSuccessMessage("✅ Épica creada con éxito");
      }
      
     
      
    } catch (error) {
      console.error("Error en onSubmit:", error);
      setErrorMessage("Error al guardar la épica");
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
          {epicId ? 'Editar Épica' : 'Crear Épica'}
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
          ></textarea>

          <button 
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Guardando..." : "Guardar"}
          </button>
        </form>
       

        {successMessage && (
          <div className="text-green-400 font-medium mt-2">{successMessage}</div>
        )}

        {errorMessage && (
          <div className="text-red-400 font-medium mt-2">{errorMessage}</div>
        )}

        <Link to={`/projects/${projectId}/epics`} className="text-blue-300 mt-4 hover:underline">
          Volver a Épicas
        </Link>
      </div>
    </div>
  );
}

export default EpicFormPage;