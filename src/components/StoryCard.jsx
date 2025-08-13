import React from "react";
import { Link } from "react-router-dom";
import { useStory } from "../components/context/StoryContext";

function StoryCard({ story, onDeleted, projectId, epicId }) {
  const { deleteStory } = useStory();

  const { _id, title, description, date, epic } = story || {};

  const finalProjectId = epic?.project?._id || projectId;
  const finalEpicId = epic?._id || epicId;

  const handleDelete = async () => {
    if (!finalProjectId || !finalEpicId || !_id) {
      console.error(
        "Faltan datos para eliminar la story (projectId, epicId o storyId)"
      );
      return;
    }
    try {
      await deleteStory(finalProjectId, finalEpicId, _id);
      if (typeof onDeleted === "function") {
        onDeleted(_id);
      }
    } catch (error) {
      console.error("Error al eliminar story:", error);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 w-72">
      <h3 className="text-xl text-center font-semibold text-gray-800">
        {title || "Sin título"}
      </h3>
      <p className="text-gray-600 text-center mt-2">
        {description || "Sin descripción"}
      </p>
      <p className="text-blue-700 text-center">
        Fecha: {date ? new Date(date).toLocaleDateString() : "Sin fecha"}
      </p>
      <div className="flex flex-col gap-2 mt-4">
        {finalProjectId && finalEpicId && _id ? (
          <Link
            to={`/projects/${finalProjectId}/epics/${finalEpicId}/stories/${_id}/tasks`}
            className="w-full bg-green-500 text-white px-4 py-2 rounded text-center hover:bg-green-600 transition-colors"
          >
            Ver Tareas
          </Link>
        ) : (
          <button
            disabled
            className="w-full bg-gray-400 text-white px-4 py-2 rounded cursor-not-allowed"
            title="Datos insuficientes para ver tareas"
          >
            Ver Tareas
          </button>
        )}

        <div className="flex justify-between gap-2">
          {finalProjectId && finalEpicId && _id ? (
            <Link
              to={`/projects/${finalProjectId}/epics/${finalEpicId}/story/${_id}`}
              className="flex-1 bg-blue-500 text-white px-4 py-2 rounded text-center hover:bg-blue-600 transition-colors"
            >
              Editar
            </Link>
          ) : (
            <button
              disabled
              className="flex-1 bg-gray-400 text-white px-4 py-2 rounded cursor-not-allowed"
              title="Datos insuficientes para editar"
            >
              Editar
            </button>
          )}

          <button
            className="flex-1 bg-red-400 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
            onClick={handleDelete}
            disabled={!finalProjectId || !finalEpicId || !_id}
            title={
              !finalProjectId || !finalEpicId || !_id
                ? "Datos insuficientes para eliminar"
                : ""
            }
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}

export default StoryCard;
