import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useStory } from "../components/context/StoryContext";
import StoryCard from "../components/StoryCard";
import { useAuth } from '../components/context/AuthContext';

const StoryPage = () => {
  const { projectId, epicId } = useParams();
  const { getStories, stories } = useStory();
 const { isAuthenticated, loading } = useAuth();
  useEffect(() => {
    if (projectId && !loading && epicId) {
      getStories(projectId, epicId);
    }
  }, [projectId, epicId]);
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

  
  if (stories.length <= 0) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-900">
        <p className="text-white mb-4">No hay Stories disponibles</p>
        <div>
          <Link
            className="text-sky-200"
            to={`/projects/${projectId}/epics/${epicId}/story`}
          >
            Cargar Story
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-900">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stories.map((story) => (
          <StoryCard story={story} key={story._id} />
        ))}
      </div>

      <Link
        to={`/projects/${projectId}/epics/${epicId}/story`}
        className="text-sky-200 my-5"
      >
        Cargar Story
      </Link>
        <div className="flex gap-4">
                  <Link 
                    to={`/projects/${projectId}/epics/${epicId}/story`} 
                    className='bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors'
                  >
                    + Crear Nueva Story
                  </Link>
                  <Link 
                    to={`/projects/${projectId}/epics` }
                    className='bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors'
                  >
                    Volver a Epics
                  </Link>
                </div>
    </div>
  );
};

export default StoryPage;
