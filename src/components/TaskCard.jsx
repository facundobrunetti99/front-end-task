import React from "react";
import { Link } from "react-router-dom";
import { useTask } from "../components/context/TaskContext";

function TaskCard({ task, onDeleted, projectId, epicId, storyId }) {
  const { deleteTask } = useTask();

  const { _id, title, description, date, story } = task || {};

  const finalProjectId = story?.epic?.project?._id || projectId;
  const finalEpicId = story?.epic?._id || epicId;
  const finalStoryId = story?._id || storyId;

  const handleDelete = async () => {
    if (!finalProjectId || !finalEpicId || !finalStoryId || !_id) {
      console.error(
        "Faltan datos para eliminar la tarea (projectId, epicId, storyId o taskId)"
      );
      return;
    }

    if (window.confirm("La tarea se eliminara")) {
      try {
        await deleteTask(finalProjectId, finalEpicId, finalStoryId, _id);
        if (typeof onDeleted === "function") {
          onDeleted(_id);
        }
      } catch (error) {
        console.error("Error al eliminar tarea:", error);
      }
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
      <p className="text-orange-700 text-center">
        Fecha: {date ? new Date(date).toLocaleDateString() : "Sin fecha"}
      </p>

      <div className="flex flex-col gap-2 mt-4">
        <div className="flex justify-between gap-2">
          {finalProjectId && finalEpicId && finalStoryId && _id ? (
            <Link
              to={`/projects/${finalProjectId}/epics/${finalEpicId}/stories/${finalStoryId}/task/${_id}`}
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
            className="flex-1 bg-green-400 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
            onClick={handleDelete}
            disabled={!finalProjectId || !finalEpicId || !finalStoryId || !_id}
            title={
              !finalProjectId || !finalEpicId || !finalStoryId || !_id
                ? "Datos insuficientes para eliminar"
                : ""
            }
          >
            Completada
          </button>
        </div>
      </div>
    </div>
  );
}

export default TaskCard;
