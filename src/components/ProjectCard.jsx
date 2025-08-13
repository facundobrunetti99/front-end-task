import React from "react";
import { useProject } from "./context/ProjectContext";
import { Link } from "react-router-dom";

function ProjectCard({ project }) {
  const { deleteProject } = useProject();

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 w-72">
      <h3 className="text-xl text-center font-semibold text-gray-800">
        {project.title}
      </h3>
      <p className="text-gray-600 text-center mt-2">{project.description}</p>
      <p className="text-blue-700 text-center">
        Fecha: {new Date(project.date).toLocaleDateString()}
      </p>

      <div className="flex flex-col gap-2 mt-4">
        <Link
          to={`/projects/${project._id}/epics`}
          className="w-full bg-green-500 text-white px-4 py-2 rounded text-center hover:bg-green-600 transition-colors"
        >
          Ver Épicas
        </Link>

        <div className="flex justify-between gap-2">
          <Link
            to={`/project/${project._id}`}
            className="flex-1 bg-blue-500 text-white px-4 py-2 rounded text-center hover:bg-blue-600 transition-colors"
          >
            Editar
          </Link>

          <button
            className="flex-1 bg-red-400 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
            onClick={() => {
              if (
                window.confirm(
                  "¿Estás seguro de que quieres eliminar este proyecto?"
                )
              ) {
                deleteProject(project._id);
              }
            }}
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProjectCard;
