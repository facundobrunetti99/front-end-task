import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useTask } from "../components/context/TaskContext";
import TaskCard from "../components/TaskCard";
import { useAuth } from '../components/context/AuthContext';

const TaskPage = () => {
  const { projectId, epicId, storyId } = useParams();
  const { getTasks, tasks } = useTask();
  const { isAuthenticated, loading } = useAuth();
  const [isLoadingTasks, setIsLoadingTasks] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      if (isAuthenticated && !loading && projectId && epicId && storyId) {
        setIsLoadingTasks(true);
        await getTasks(projectId, epicId, storyId);
        setIsLoadingTasks(false);
      } else if (!loading && !isAuthenticated) {
        // Si no está autenticado, no cargar tasks
        setIsLoadingTasks(false);
      }
    };
    
    fetchTasks();
  }, [projectId, epicId, storyId, isAuthenticated, loading]);

  // Mostrar loading mientras se verifica auth
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <p className="text-white">Verificando autenticación...</p>
      </div>
    );
  }

  // Si no está autenticado, no mostrar nada
  if (!isAuthenticated) {
    return null;
  }

  // Mostrar loading mientras se cargan las tareas
  if (isLoadingTasks) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <p className="text-white">Cargando tareas...</p>
      </div>
    );
  }

  // Vista cuando no hay tareas
  if (tasks.length <= 0) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-900 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">
            Tareas de la Historia
          </h1>
          <Link
            to={`/projects/${projectId}/epics/${epicId}/stories`}
            className="text-blue-300 hover:underline mr-4"
          >
            ← Volver a Historias
          </Link>
        </div>
        
        <div className='flex flex-col justify-center items-center'>
          <p className="text-white mb-6 text-lg">
            No hay Tareas disponibles para esta historia
          </p>
          <div className="flex gap-4">
            <Link
              className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
              to={`/projects/${projectId}/epics/${epicId}/stories/${storyId}/task`}
            >
              + Crear Primera Tarea
            </Link>
            <Link
              className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors"
              to={`/projects/${projectId}/epics/${epicId}/stories`}
            >
              Volver a Historias
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Vista principal con tareas
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-900 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-4">
          Tareas de la Historia
        </h1>
        <Link
          to={`/projects/${projectId}/epics/${epicId}/stories`}
          className="text-blue-300 hover:underline mr-4"
        >
          ← Volver a Historias
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {tasks.map((task) => (
          <TaskCard
            task={task}
            key={task._id}
            projectId={projectId}
            epicId={epicId}
            storyId={storyId}
          />
        ))}
      </div>

      <div className="flex gap-4">
        <Link
          to={`/projects/${projectId}/epics/${epicId}/stories/${storyId}/task`}
          className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
        >
          + Crear Nueva Tarea
        </Link>
        <Link
          to={`/projects/${projectId}/epics/${epicId}/stories`}
          className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors"
        >
          Volver a Historias
        </Link>
      </div>
    </div>
  );
};

export default TaskPage;
