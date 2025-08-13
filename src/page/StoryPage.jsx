import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useStory } from "../components/context/StoryContext";
import StoryCard from "../components/StoryCard";
import { useAuth } from '../components/context/AuthContext';

const StoryPage = () => {
  const { projectId, epicId } = useParams();
  const { getStories, stories } = useStory();
  const { isAuthenticated, loading } = useAuth();
  const [isLoadingStories, setIsLoadingStories] = useState(true);

  useEffect(() => {
    const fetchStories = async () => {
      if (isAuthenticated && !loading && projectId && epicId) {
        setIsLoadingStories(true);
        await getStories(projectId, epicId);
        setIsLoadingStories(false);
      } else if (!loading && !isAuthenticated) {
        // Si no está autenticado, no cargar stories
        setIsLoadingStories(false);
      }
    };
    
    fetchStories();
  }, [projectId, epicId, isAuthenticated, loading]);

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

  // Mostrar loading mientras se cargan las stories
  if (isLoadingStories) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <p className="text-white">Cargando stories...</p>
      </div>
    );
  }

  // Vista cuando no hay stories
  if (stories.length <= 0) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-900 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">Stories de la Épica</h1>
          <Link 
            to={`/projects/${projectId}/epics`}
            className="text-blue-300 hover:underline mr-4"
          >
            ← Volver a Épicas
          </Link>
        </div>
        
        <div className='flex flex-col justify-center items-center'>
          <p className="text-white mb-6 text-lg">No hay Stories disponibles para esta épica</p>
          <div className="flex gap-4">
            <Link
              className='bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors'
              to={`/projects/${projectId}/epics/${epicId}/story`}
            >
              + Crear Primera Story
            </Link>
            <Link 
              to={`/projects/${projectId}/epics`}
              className='bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors'
            >
              Volver a Épicas
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Vista principal con stories
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-900 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-4">Stories de la Épica</h1>
        <Link 
          to={`/projects/${projectId}/epics`}
          className="text-blue-300 hover:underline mr-4"
        >
          ← Volver a Épicas
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {stories.map((story) => (
          <StoryCard story={story} key={story._id} />
        ))}
      </div>

      <div className="flex gap-4">
        <Link 
          to={`/projects/${projectId}/epics/${epicId}/story`} 
          className='bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors'
        >
          + Crear Nueva Story
        </Link>
        <Link 
          to={`/projects/${projectId}/epics`}
          className='bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors'
        >
          Volver a Épicas
        </Link>
      </div>
    </div>
  );
};

export default StoryPage;
