import React from "react";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useProject } from "../components/context/ProjectContext";
import ProjectCard from "../components/ProjectCard";
import { useAuth } from '../components/context/AuthContext';
const ProjectPage = () => {
  const { getProjects, projects } = useProject();
  const { isAuthenticated, loading } = useAuth();
  
 useEffect(() => {
    if (isAuthenticated && !loading) {
      getProjects();
    }
  }, [isAuthenticated, loading]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <p className="text-white">Verificando autenticación...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (projects.length <= 0) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-900">
        <p className="text-white mb-4">No hay proyects disponibles</p>
        <div>
          <Link className="text-sky-200" to={"/project"}>
            Cargar proyecto
          </Link>
        </div>
      </div>
    );
  }
  return (
    <div className="flex  flex-col justify-center items-center min-h-screen bg-gray-900">
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.length <= 0 ? (
            <p className="text-white">No hay proyects disponibles</p>
          ) : (
            projects.map((project) => (
              <ProjectCard project={project} key={project._id}></ProjectCard>
            ))
          )}
        </div>
      </div>
      <Link to={"/project"} className="text-sky-200 my-5">
        Cargar Proyectos
      </Link>
    </div>
  );
};

export default ProjectPage;
