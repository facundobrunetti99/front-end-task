import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useStory } from "../components/context/StoryContext";
import { Link, useParams } from "react-router-dom";

function StoryFormPage() {
  const { register, handleSubmit, setValue } = useForm();
  const { createStory, getStory, updateStory } = useStory();
  const [successMessage, setSuccessMessage] = useState("");
  const { projectId, epicId, id } = useParams();
  useEffect(() => {
    async function loadStory() {
      if (id) {
        const story = await getStory(projectId, epicId, id);
        setValue("title", story.title);
        setValue("description", story.description);
      }
    }
    loadStory();
  }, [id, projectId, epicId, setValue]);

  const onSubmit = handleSubmit(async (data) => {
    if (id) {
      await updateStory(projectId, epicId, id, data);
      setSuccessMessage("✅ Story actualizada con éxito");
      setTimeout(() => {
          reset({
            title: "",
            description: ""
          });
        }, 1500); 
    } else {
      await createStory(projectId, epicId, data);
      setSuccessMessage("✅ Story creada con éxito");
      setTimeout(() => {
          reset({
            title: "",
            description: ""
          });
        }, 1500); 
    }
  });

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <div className="bg-zinc-800 max-w-md w-full p-10 rounded-md flex flex-col gap-2">
        <form onSubmit={onSubmit} className="flex flex-col gap-2">
          <input
            type="text"
            placeholder="Título"
            {...register("title")}
            className="bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
          />
          <textarea
            rows="3"
            placeholder="Descripción"
            {...register("description")}
            className="bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
          />
          <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md">
            Guardar
          </button>
        </form>
        {successMessage && (
          <div className="text-green-400 font-medium mt-2">
            {successMessage}
          </div>
        )}
        <Link
          to={`/projects/${projectId}/epics/${epicId}/stories`}
          className="text-blue-300 mt-4 hover:underline"
        >
          Mostrar Stories
        </Link>
      </div>
    </div>
  );
}

export default StoryFormPage;
