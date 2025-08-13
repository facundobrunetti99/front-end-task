import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation, useParams } from "react-router-dom";
import { useAuth } from "../components/context/AuthContext";
import { useProject } from "../components/context/ProjectContext";
import { useEpic } from "../components/context/EpicContext";
import { useStory } from "../components/context/StoryContext";
import { useTask } from "../components/context/TaskContext";
import { Menu, X, ChevronRight } from "lucide-react";
import { Outlet } from "react-router-dom";

function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();
  const { projects, getProjects } = useProject();
  const { epics, getEpics } = useEpic();
  const { stories, getStories } = useStory();
  const { tasks, getTasks } = useTask();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);

  const getCurrentIds = () => {
    const pathParts = location.pathname.split("/");
    const projectIndex = pathParts.indexOf("projects");
    const epicIndex = pathParts.indexOf("epics");
    const storyIndex = pathParts.indexOf("stories");

    return {
      projectId:
        projectIndex !== -1 && pathParts[projectIndex + 1]
          ? pathParts[projectIndex + 1]
          : null,
      epicId:
        epicIndex !== -1 && pathParts[epicIndex + 1]
          ? pathParts[epicIndex + 1]
          : null,
      storyId:
        storyIndex !== -1 && pathParts[storyIndex + 1]
          ? pathParts[storyIndex + 1]
          : null,
    };
  };

  const {
    projectId: currentProjectId,
    epicId: currentEpicId,
    storyId: currentStoryId,
  } = getCurrentIds();

  useEffect(() => {
    if (isAuthenticated) {
      getProjects();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (currentProjectId && isAuthenticated) {
      getEpics(currentProjectId);
    }
  }, [currentProjectId, isAuthenticated]);

  useEffect(() => {
    if (currentProjectId && currentEpicId && isAuthenticated) {
      getStories(currentProjectId, currentEpicId);
    }
  }, [currentProjectId, currentEpicId, isAuthenticated]);

  useEffect(() => {
    if (
      currentProjectId &&
      currentEpicId &&
      currentStoryId &&
      isAuthenticated
    ) {
      getTasks(currentProjectId, currentEpicId, currentStoryId);
    }
  }, [currentProjectId, currentEpicId, currentStoryId, isAuthenticated]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const currentProject = projects.find((p) => p._id === currentProjectId);
  const currentEpic = epics.find((e) => e._id === currentEpicId);
  const currentStory = stories.find((s) => s._id === currentStoryId);

  const recentProjects = projects.slice(0, 5);
  const currentEpics = epics.slice(0, 5);
  const currentStories = stories.slice(0, 5);
  const currentTasks = tasks.slice(0, 8);

  return (
    <div className="flex">
      {/* Botón flotante cuando la barra está cerrada */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed top-4 left-4 z-50 bg-gray-800 text-white p-2 rounded-md shadow-lg hover:bg-gray-700 transition-colors"
        >
          <Menu size={20} />
        </button>
      )}

      {/* Barra lateral */}
      <div
        className={`${
          isOpen ? "w-64" : "w-0"
        } h-screen bg-gray-800 text-white transition-all duration-300 flex flex-col fixed top-0 left-0 z-50 overflow-hidden`}
      >
        <div className="p-4 flex items-center justify-between min-w-64">
          <span className="text-lg font-bold">Administrador de Tareas</span>
          <button onClick={() => setIsOpen(false)} className="ml-auto">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 flex flex-col gap-2 px-4 pb-4 overflow-y-auto min-w-64">
          {!isAuthenticated ? (
            <>
              <Link
                to="/"
                className="text-gray-300 hover:text-white py-2 px-2 rounded hover:bg-gray-700 transition-colors"
              >
                🏠 Inicio
              </Link>
              <Link
                to="/login"
                className="text-gray-300 hover:text-white py-2 px-2 rounded hover:bg-gray-700 transition-colors"
              >
                🔑 Iniciar sesión
              </Link>
              <Link
                to="/register"
                className="text-gray-300 hover:text-white py-2 px-2 rounded hover:bg-gray-700 transition-colors"
              >
                📝 Registrarse
              </Link>
            </>
          ) : (
            <>
              <p className="text-gray-400 mb-4 text-sm border-b border-gray-600 pb-2">
                Bienvenido <b>{user.username}</b>
              </p>

              <Link
                to="/"
                className="text-gray-300 hover:text-white py-2 px-2 rounded hover:bg-gray-700 transition-colors"
              >
                🏠 Inicio
              </Link>

              {currentProject && (
                <div className="bg-gray-700 rounded p-3 mb-4">
                  <div className="text-xs text-gray-300 mb-1">
                    CONTEXTO ACTUAL
                  </div>
                  <div className="text-sm text-white">
                    <div className="flex items-center mb-1">
                      <span className="truncate">{currentProject.title}</span>
                    </div>
                    {currentEpic && (
                      <div className="flex items-center mb-1 ml-2">
                        <ChevronRight
                          size={12}
                          className="mr-1 text-gray-400"
                        />
                        <span className="truncate text-blue-300">
                          {currentEpic.title}
                        </span>
                      </div>
                    )}
                    {currentStory && (
                      <div className="flex items-center ml-4">
                        <ChevronRight
                          size={12}
                          className="mr-1 text-gray-400"
                        />
                        <span className="truncate text-green-300">
                          {currentStory.title}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <h3 className="text-gray-400 text-sm font-semibold mt-4 mb-2">
                PROYECTOS
              </h3>
              <Link
                to="/projects"
                className="text-gray-300 hover:text-white py-2 px-2 rounded hover:bg-gray-700 transition-colors"
              >
                📁 Ver Proyectos
              </Link>
              <Link
                to="/project"
                className="text-gray-300 hover:text-white py-2 px-2 rounded hover:bg-gray-700 transition-colors"
              >
                ➕ Nuevo Proyecto
              </Link>

              {recentProjects.length > 0 && (
                <>
                  <h3 className="text-gray-400 text-sm font-semibold mt-4 mb-2">
                    PROYECTOS RECIENTES
                  </h3>
                  {recentProjects.map((project) => (
                    <Link
                      key={project._id}
                      to={`/projects/${project._id}/epics`}
                      className={`text-gray-300 hover:text-white py-1 px-2 rounded hover:bg-gray-700 transition-colors text-sm ${
                        currentProjectId === project._id
                          ? "bg-blue-900 text-blue-200"
                          : ""
                      }`}
                    >
                      <span className="truncate block">📁 {project.title}</span>
                    </Link>
                  ))}
                </>
              )}

              {currentProjectId && currentEpics.length > 0 && (
                <>
                  <h3 className="text-gray-400 text-sm font-semibold mt-4 mb-2">
                    ÉPICAS ACTUALES
                  </h3>
                  {currentEpics.map((epic) => (
                    <Link
                      key={epic._id}
                      to={`/projects/${currentProjectId}/epics/${epic._id}/stories`}
                      className={`text-gray-300 hover:text-white py-1 px-2 rounded hover:bg-gray-700 transition-colors text-sm ${
                        currentEpicId === epic._id
                          ? "bg-blue-900 text-blue-200"
                          : ""
                      }`}
                    >
                      <span className="truncate block">⚡ {epic.title}</span>
                    </Link>
                  ))}
                  <Link
                    to={`/projects/${currentProjectId}/epics/new`}
                    className="text-gray-400 hover:text-gray-200 py-1 px-2 rounded hover:bg-gray-700 transition-colors text-xs"
                  >
                    ➕ Nueva Épica
                  </Link>
                </>
              )}

              {currentProjectId &&
                currentEpicId &&
                currentStories.length > 0 && (
                  <>
                    <h3 className="text-gray-400 text-sm font-semibold mt-4 mb-2">
                      HISTORIAS ACTUALES
                    </h3>
                    {currentStories.map((story) => (
                      <Link
                        key={story._id}
                        to={`/projects/${currentProjectId}/epics/${currentEpicId}/stories/${story._id}/tasks`}
                        className={`text-gray-300 hover:text-white py-1 px-2 rounded hover:bg-gray-700 transition-colors text-sm ${
                          currentStoryId === story._id
                            ? "bg-green-900 text-green-200"
                            : ""
                        }`}
                      >
                        <span className="truncate block">📖 {story.title}</span>
                      </Link>
                    ))}
                    <Link
                      to={`/projects/${currentProjectId}/epics/${currentEpicId}/story`}
                      className="text-gray-400 hover:text-gray-200 py-1 px-2 rounded hover:bg-gray-700 transition-colors text-xs"
                    >
                      ➕ Nueva Historia
                    </Link>
                  </>
                )}

              {currentProjectId &&
                currentEpicId &&
                currentStoryId &&
                currentTasks.length > 0 && (
                  <>
                    <h3 className="text-gray-400 text-sm font-semibold mt-4 mb-2">
                      TAREAS ACTUALES
                    </h3>
                    <div className="max-h-48 overflow-y-auto">
                      {currentTasks.map((task) => (
                        <Link
                          key={task._id}
                          to={`/projects/${currentProjectId}/epics/${currentEpicId}/stories/${currentStoryId}/task/${task._id}`}
                          className={`text-gray-300 hover:text-white py-1 px-2 rounded hover:bg-gray-700 transition-colors text-sm block mb-1 ${
                            task.completed ? "text-green-400" : "text-gray-300"
                          }`}
                        >
                          <span className="truncate block flex items-center">
                            <span className="mr-2">
                              {task.completed ? "✅" : "⏳"}
                            </span>
                            <span className="truncate">{task.title}</span>
                          </span>
                        </Link>
                      ))}
                    </div>
                    <Link
                      to={`/projects/${currentProjectId}/epics/${currentEpicId}/stories/${currentStoryId}/task`}
                      className="text-gray-400 hover:text-gray-200 py-1 px-2 rounded hover:bg-gray-700 transition-colors text-xs"
                    >
                      ➕ Nueva Tarea
                    </Link>
                  </>
                )}

              {!currentProjectId && (
                <div className="text-gray-500 text-xs mt-4 p-2 bg-gray-700 rounded">
                  💡 Selecciona un proyecto para ver toda la jerarquía
                </div>
              )}

              {currentProjectId &&
                !currentEpicId &&
                epics.length === 0 && (
                  <div className="text-gray-500 text-xs mt-4 p-2 bg-gray-700 rounded">
                    📝 Crea una épica para organizar tus historias
                  </div>
                )}

              {currentEpicId &&
                !currentStoryId &&
                stories.length === 0 && (
                  <div className="text-gray-500 text-xs mt-4 p-2 bg-gray-700 rounded">
                    📖 Crea una historia para agregar tareas
                  </div>
                )}
              <button
                onClick={handleLogout}
                className="text-gray-300 hover:text-white text-left mt-auto py-2 px-2 rounded hover:bg-gray-700 transition-colors"
              >
                🚪 Cerrar Sesión
              </button>
            </>
          )}
        </div>
      </div>

      {/* Contenido principal */}
      <div
        className={`${
          isOpen ? "ml-64" : "ml-0"
        } transition-all duration-300 w-full`}
      >
        <Outlet />
      </div>
    </div>
  );
}

export default Navbar;

