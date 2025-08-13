import React, { createContext, useContext, useState } from "react";
import {
  getProjectRequest,
  getProjectsRequest,
  deleteProjectRequest,
  updateProjectRequest,
  createProjectRequest,
} from "../../api/project.js";
const ProjectContext = createContext();
export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("useProject debe estar dentro de ProjectProvider");
  }
  return context;
};
export function ProjectProvider({ children }) {
  const [projects, setProjects] = useState([]);
  const { isAuthenticated, user, loading } = useAuth();

  // Función para limpiar proyectos
  const clearProjects = () => {
    setProjects([]);
  };

  // Limpiar proyectos automáticamente cuando cambie la autenticación
  useEffect(() => {
    if (!isAuthenticated || !user) {
      clearProjects();
    }
  }, [isAuthenticated, user]);


  
  const createProject = async (project) => {
    const res = await createProjectRequest(project);
    setProjects([...projects, res.data]);
    console.log(res.data);
    return res.data;
  };
const getProjects = async () => {
    // No hacer la petición si no está autenticado o está cargando
    if (!isAuthenticated || loading) {
      return;
    }

    try {
      const res = await getProjectsRequest();
      setProjects(res.data);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error("No autorizado:", error.response.data.message);
        clearProjects(); // Limpiar proyectos si no está autorizado
      } else if (error.response && error.response.status === 404) {
        console.error("No se encontraron Proyectos.");
        setProjects([]); // Establecer array vacío si no hay proyectos
      } else {
        console.error("Error al obtener proyectos:", error);
      }
    }
  };
  const deleteProject = async (id) => {
    try {
      await deleteProjectRequest(id);
      setProjects(projects.filter((project) => project._id !== id));
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.error("Proyecto no encontrado para eliminar.");
      }
    }
  };
  const getProject = async (id) => {
    try {
      const res = await getProjectRequest(id);
      return res.data;
    } catch (error) {
      console.error("Error al obtener proyecto:", error);
      if (error.response && error.response.status === 404) {
        console.error("Proyecto no encontrado.");
        return null;
      }
      throw error;
    }
  };
  const updateProject = async (id, project) => {
    try {
      const res = await updateProjectRequest(id, project);
      setProjects(projects.map((p) => (p._id === id ? res.data : p)));
      return res.data;
    } catch (error) {
      console.error("Error al actualizar proyecto:", error);
      if (error.response && error.response.status === 404) {
        console.error("Proyecto no encontrado para actualizar.");
      }
      throw error;
    }
  };
  return (
    <ProjectContext.Provider
      value={{
        projects,
        createProject,
        getProject,
        getProjects,
        deleteProject,
        updateProject,
        clearProjects,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

