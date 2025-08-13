import { Link, useParams } from 'react-router-dom';
import React from 'react';
import { useEpic } from '../components/context/EpicContext'; 

function EpicCard({ epic }) {
    const { deleteEpic } = useEpic();
    const { projectId } = useParams();

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 w-72">
            <h3 className="text-xl text-center font-semibold text-gray-800">{epic.title}</h3>
            <p className="text-gray-600 text-center mt-2">{epic.description}</p>
            
            <div className='flex flex-col gap-2 mt-4'>
              
                <Link 
                    to={`/projects/${projectId}/epics/${epic._id}/stories`} 
                    className="w-full bg-purple-500 text-white px-4 py-2 rounded text-center hover:bg-purple-600 transition-colors"
                >
                    Ver Historias
                </Link>
            
                <div className='flex justify-between gap-2'>
                    <Link 
                        to={`/projects/${projectId}/epics/${epic._id}`} 
                        className="flex-1 bg-blue-500 text-white px-4 py-2 rounded text-center hover:bg-blue-600 transition-colors"
                    >
                        Editar
                    </Link>
                    
                    <button
                        className='flex-1 bg-red-400 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors'
                        onClick={() => {
                            if (window.confirm('¿Estás seguro de que quieres eliminar esta épica?')) {
                                deleteEpic(projectId, epic._id);
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

export default EpicCard;