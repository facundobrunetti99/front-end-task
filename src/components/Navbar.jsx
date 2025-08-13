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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsOpen(false);
      } else {
        setIsOpen(true); 
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  const handleToggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLinkClick = () => {
   
    if (isMobile) {
      setIsOpen(false);
    }
  };

  const currentProject = projects.find((p) => p._id === currentProjectId);
  const currentEpic = epics.find((e) => e._id === currentEpicId);
  const currentStory = stories.find((s) => s._id === currentStoryId);

  const recentProjects = projects.slice(0, 5);
  const currentEpics = epics.slice(0, 5);
  const currentStories = stories.slice(0, 5);
  const currentTasks = tasks.slice(0, 8);

  return (
    <div className="flex min-h-screen">
      
      {isMobile && !isOpen && (
        <button
          onClick={handleToggleMenu}
          className="fixed top-4 left-4 z-50 bg-gray-800 text-white p-3 rounded-lg shadow-lg hover:bg-gray-700 transition-colors"
        >
          <Menu size={20} />
        </button>
      )}

      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={handleToggleMenu}
        />
      )}

    
      <div
        className={`${
          isMobile 
            ? isOpen 
              ? "w-64 translate-x-0" 
              : "w-0 -translate-x-full"
            : isOpen 
              ? "w-64" 
              : "w-16"
        } h-screen bg-gray-800 text-white transition-all duration-300 flex flex-col ${
          isMobile 
            ? "fixed top-0 left-0 z-50" 
            : "fixed top-0 left-0 z-50"
        } overflow-hidden`}
      >
        <div className="p-4 flex items-center justify-between min-h-[60px]">
          <span className={`text-lg font-bold transition-opacity duration-300 ${
            isMobile ? (isOpen ? "opacity-100" : "opacity-0") : (isOpen ? "opacity-100" : "opacity-0")
          }`}>
            {(isMobile && isOpen) || (!isMobile && isOpen) ? "Administrador de Tareas" : "AT"}
          </span>
          {!isMobile && (
            <span className={`text-lg font-bold transition-opacity duration-300 ${
              !isOpen ? "opacity-100" : "opacity-0"
            }`}>
              {!isOpen ? "AT" : ""}
            </span>
          )}
          <button 
            onClick={handleToggleMenu} 
            className={`${isMobile && !isOpen ? "hidden" : "block"} hover:bg-gray-700 p-1 rounded transition-colors`}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <div className={`flex-1 flex flex-col gap-2 px-4 pb-4 overflow-y-auto ${
          isMobile && !isOpen ? "hidden" : "block"
        }`}>
          {!isAuthenticated ? (
            <>
              <Link
                to="/"
                onClick={handleLinkClick}
                className="text-gray-300 hover:text-white py-2 px-2 rounded hover:bg-gray-700 transition-colors"
              >
                {(isMobile && isOpen) || (!isMobile && isOpen) ? "🏠 Inicio" : "🏠"}
              </Link>
              <Link
                to="/login"
                onClick={handleLinkClick}
                className="text-gray-300 hover:text-white py-2 px-2 rounded hover:bg-gray-700 transition-colors"
              >
                {(isMobile && isOpen) || (!isMobile && isOpen) ? "🔑 Iniciar sesión" : "🔑"}
              </Link>
              <Link
                to="/register"
                onClick={handleLinkClick}
                className="text-gray-300 hover:text-white py-2 px-2 rounded hover:bg-gray-700 transition-colors"
              >
                {(isMobile && isOpen) || (!isMobile && isOpen) ? "📝 Registrarse" : "📝"}
              </Link>
            </>
          ) : (
            <>
              {((isMobile && isOpen) || (!isMobile && isOpen)) && (
                <p className="text-gray-400 mb-4 text-sm border-b border-gray-600 pb-2">
                  Bienvenido <b>{user.username}</b>
                </p>
              )}

              <Link
                to="/"
                onClick={handleLinkClick}
                className="text-gray-300 hover:text-white py-2 px-2 rounded hover:bg-gray-700 transition-colors"
              >
                {(isMobile && isOpen) || (!isMobile && isOpen) ? "🏠 Inicio" : "🏠"}
              </Link>

              {((isMobile && isOpen) || (!isMobile && isOpen)) && currentProject && (
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

              {((isMobile && isOpen) || (!isMobile && isOpen)) && (
                <h3 className="text-gray-400 text-sm font-semibold mt-4 mb-2">
                  PROYECTOS
                </h3>
              )}
              <Link
                to="/projects"
                onClick={handleLinkClick}
                className="text-gray-300 hover:text-white py-2 px-2 rounded hover:bg-gray-700 transition-colors"
              >
                {(isMobile && isOpen) || (!isMobile && isOpen) ? "📁 Ver Proyectos" : "📁"}
              </Link>
              <Link
                to="/project"
                onClick={handleLinkClick}
                className="text-gray-300 hover:text-white py-2 px-2 rounded hover:bg-gray-700 transition-colors"
              >
                {(isMobile && isOpen) || (!isMobile && isOpen) ? "➕ Nuevo Proyecto" : "➕"}
              </Link>

              {((isMobile && isOpen) || (!isMobile && isOpen)) && recentProjects.length > 0 && (
                <>
                  <h3 className="text-gray-400 text-sm font-semibold mt-4 mb-2">
                    PROYECTOS RECIENTES
                  </h3>
                  {recentProjects.map((project) => (
                    <Link
                      key={project._id}
                      to={`/projects/${project._id}/epics`}
                      onClick={handleLinkClick}
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

              {((isMobile && isOpen) || (!isMobile && isOpen)) && currentProjectId && currentEpics.length > 0 && (
                <>
                  <h3 className="text-gray-400 text-sm font-semibold mt-4 mb-2">
                    ÉPICAS ACTUALES
                  </h3>
                  {currentEpics.map((epic) => (
                    <Link
                      key={epic._id}
                      to={`/projects/${currentProjectId}/epics/${epic._id}/stories`}
                      onClick={handleLinkClick}
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
                    onClick={handleLinkClick}
                    className="text-gray-400 hover:text-gray-200 py-1 px-2 rounded hover:bg-gray-700 transition-colors text-xs"
                  >
                    ➕ Nueva Épica
                  </Link>
                </>
              )}

              {((isMobile && isOpen) || (!isMobile && isOpen)) &&
                currentProjectId &&
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
                        onClick={handleLinkClick}
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
                      onClick={handleLinkClick}
                      className="text-gray-400 hover:text-gray-200 py-1 px-2 rounded hover:bg-gray-700 transition-colors text-xs"
                    >
                      ➕ Nueva Historia
                    </Link>
                  </>
                )}

              {((isMobile && isOpen) || (!isMobile && isOpen)) &&
                currentProjectId &&
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
                          onClick={handleLinkClick}
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
                      onClick={handleLinkClick}
                      className="text-gray-400 hover:text-gray-200 py-1 px-2 rounded hover:bg-gray-700 transition-colors text-xs"
                    >
                      ➕ Nueva Tarea
                    </Link>
                  </>
                )}

              {((isMobile && isOpen) || (!isMobile && isOpen)) && !currentProjectId && (
                <div className="text-gray-500 text-xs mt-4 p-2 bg-gray-700 rounded">
                  💡 Selecciona un proyecto para ver toda la jerarquía
                </div>
              )}

              {((isMobile && isOpen) || (!isMobile && isOpen)) &&
                currentProjectId &&
                !currentEpicId &&
                epics.length === 0 && (
                  <div className="text-gray-500 text-xs mt-4 p-2 bg-gray-700 rounded">
                    📝 Crea una épica para organizar tus historias
                  </div>
                )}

              {((isMobile && isOpen) || (!isMobile && isOpen)) &&
                currentEpicId &&
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
                {(isMobile && isOpen) || (!isMobile && isOpen) ? "🚪 Cerrar Sesión" : "🚪"}
              </button>
            </>
          )}
        </div>
      </div>
      <div
        className={`${
          isMobile 
            ? "ml-0" 
            : isOpen 
              ? "ml-64" 
              : "ml-16"
        } transition-all duration-300 flex-1`}
      >
        <Outlet />
      </div>
    </div>
  );
}

export default Navbar;
