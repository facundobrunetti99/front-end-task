import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../components/context/AuthContext";
import { useProject } from "../components/context/ProjectContext";
import { useTask } from "../components/context/TaskContext";
import {
  FolderOpen,
  Zap,
  BookOpen,
  CheckSquare,
  Plus,
  TrendingUp,
  Clock,
  Users,
  Target,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const HomePage = () => {
  const { isAuthenticated, user } = useAuth();
  const { projects, getProjects } = useProject();
  const [stats, setStats] = useState({
    totalProjects: 0,
    recentProjects: 0,
    totalTasks: 0,
    completedTasks: 0,
  });

  useEffect(() => {
    if (isAuthenticated) {
      getProjects();
    }
  }, [isAuthenticated]);

  const recentProjects = projects.slice(0, 3);

  if (!isAuthenticated) {
    return <GuestHomePage />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-800 text-white py-16 px-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-blue-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10">
        <div className="max-w-6xl mx-auto text-center mb-16">
          <div className="flex items-center justify-center mb-4">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
              ¡Hola, {user?.username}!
            </h1>
          </div>
          <p className="text-gray-300 text-lg md:text-xl mb-8">
            Bienvenido a tu espacio de productividad. ¿Qué quieres lograr hoy?
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mb-8">
            <StatCard icon={<FolderOpen size={20} />} label="Proyectos" />
            <StatCard icon={<TrendingUp size={20} />} label="Esta semana" />
            <StatCard icon={<CheckSquare size={20} />} label="Tareas totales" />
            <StatCard icon={<Target size={20} />} label="Completadas" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto mb-16">
          <ActionCard
            title="Proyectos"
            description="Crea y gestiona tus proyectos principales"
            icon={<FolderOpen size={32} />}
            color="from-purple-500 to-purple-700"
            link="/projects"
            actionText="Ver proyectos"
            actionLink="/project"
            actionLabel="Nuevo proyecto"
          />
          <ActionCard
            title="Épicas"
            description="Organiza grandes bloques de trabajo"
            icon={<Zap size={32} />}
            color="from-pink-500 to-pink-700"
            link="/projects"
            actionText="Explorar épicas"
            disabled={projects.length === 0}
            disabledMessage="Crea un proyecto primero"
          />
          <ActionCard
            title="Historias"
            description="Define historias de usuario detalladas"
            icon={<BookOpen size={32} />}
            color="from-green-500 to-green-700"
            link="/projects"
            actionText="Ver historias"
            disabled={projects.length === 0}
            disabledMessage="Crea un proyecto primero"
          />
          <ActionCard
            title="Tareas"
            description="Gestiona tareas específicas y detalladas"
            icon={<CheckSquare size={32} />}
            color="from-blue-500 to-blue-700"
            link="/projects"
            actionText="Ver tareas"
            actionLink="/projects"
            actionLabel="Nueva tarea"
          />
        </div>

        {recentProjects.length > 0 && (
          <div className="max-w-6xl mx-auto mb-16">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
              Proyectos recientes
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentProjects.map((project) => (
                <ProjectCard key={project._id} project={project} />
              ))}
            </div>
          </div>
        )}

        <div className="text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">
              ¿Listo para ser más productivo?
            </h3>
            <p className="text-gray-200 mb-6">
              Comienza creando tu primer proyecto o explora las tareas
              existentes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/project"
                className="inline-flex items-center justify-center bg-white text-purple-600 font-semibold py-3 px-6 rounded-lg transition-all hover:bg-gray-100 hover:scale-105"
              >
                <Plus className="mr-2" size={20} />
                Crear proyecto
              </Link>
              <Link
                to="/projects"
                className="inline-flex items-center justify-center border-2 border-white text-white font-semibold py-3 px-6 rounded-lg transition-all hover:bg-white hover:text-purple-600 hover:scale-105"
              >
                Ver todos los proyectos
                <ArrowRight className="ml-2" size={20} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const GuestHomePage = () => (
  <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white py-16 px-4 relative overflow-hidden">
    <div className="absolute top-0 left-0 w-full h-full opacity-5">
      <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/3 right-1/3 w-72 h-72 bg-purple-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
    </div>

    <div className="relative z-10">
      <div className="max-w-6xl mx-auto text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
          Gestiona tus proyectos con inteligencia
        </h1>
        <p className="text-gray-300 text-lg md:text-xl mb-8">
          La plataforma completa para organizar proyectos, épicas, historias y
          tareas
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto mb-16">
        <FeatureCard
          title="Proyectos"
          description="Organiza tus ideas en proyectos estructurados y escalables"
          icon={<FolderOpen size={32} />}
          color="from-purple-500 to-purple-700"
        />
        <FeatureCard
          title="Épicas"
          description="Agrupa funcionalidades en bloques de trabajo manejables"
          icon={<Zap size={32} />}
          color="from-pink-500 to-pink-700"
        />
        <FeatureCard
          title="Historias"
          description="Define requisitos desde la perspectiva del usuario"
          icon={<BookOpen size={32} />}
          color="from-green-500 to-green-700"
        />
        <FeatureCard
          title="Tareas"
          description="Divide el trabajo en elementos accionables y medibles"
          icon={<CheckSquare size={32} />}
          color="from-blue-500 to-blue-700"
        />
      </div>

      <div className="text-center">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 max-w-2xl mx-auto">
          <h3 className="text-2xl font-bold mb-4">¿Listo para comenzar?</h3>
          <p className="text-gray-200 mb-6">
            Únete y transforma la manera en que gestionas tus proyectos
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="inline-flex items-center justify-center bg-white text-purple-600 font-semibold py-3 px-6 rounded-lg transition-all hover:bg-gray-100 hover:scale-105"
            >
              <Users className="mr-2" size={20} />
              Registrarse gratis
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center border-2 border-white text-white font-semibold py-3 px-6 rounded-lg transition-all hover:bg-white hover:text-purple-600 hover:scale-105"
            >
              Iniciar sesión
              <ArrowRight className="ml-2" size={20} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const StatCard = ({ icon, value, label }) => (
  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
    <div className="flex items-center justify-center mb-2 text-blue-400">
      {icon}
    </div>
    <div className="text-2xl font-bold">{value}</div>
    <div className="text-xs text-gray-400">{label}</div>
  </div>
);

const ActionCard = ({
  title,
  description,
  icon,
  color,
  link,
  actionText,
  actionLink,
  actionLabel,
  disabled,
  disabledMessage,
}) => (
  <div
    className={`rounded-xl p-6 shadow-lg bg-gradient-to-br ${color} transition-all hover:scale-105 ${
      disabled ? "opacity-50" : ""
    } relative overflow-hidden`}
  >
    <div className="absolute top-0 right-0 w-16 h-16 bg-white/20 rounded-full blur-xl"></div>

    <div className="relative z-10">
      <div className="flex items-center mb-4">
        {icon}
        <h2 className="text-2xl font-bold ml-3">{title}</h2>
      </div>
      <p className="text-white/90 text-sm mb-6">{description}</p>

      {disabled ? (
        <div className="text-white/70 text-sm italic">{disabledMessage}</div>
      ) : (
        <div className="space-y-2">
          <Link
            to={link}
            className="block w-full bg-white/20 hover:bg-white/30 text-white text-center py-2 px-4 rounded-lg transition-all text-sm font-medium"
          >
            {actionText}
          </Link>
          {actionLink && (
            <Link
              to={actionLink}
              className="block w-full bg-white text-gray-900 text-center py-2 px-4 rounded-lg transition-all hover:bg-gray-100 text-sm font-medium"
            >
              <Plus className="inline mr-1" size={16} />
              {actionLabel}
            </Link>
          )}
        </div>
      )}
    </div>
  </div>
);

const FeatureCard = ({ title, description, icon, color }) => (
  <div
    className={`rounded-xl p-6 shadow-lg bg-gradient-to-br ${color} transition-transform hover:scale-105`}
  >
    <div className="flex items-center mb-4">
      {icon}
      <h2 className="text-2xl font-bold ml-3">{title}</h2>
    </div>
    <p className="text-white/90 text-sm">{description}</p>
  </div>
);

const ProjectCard = ({ project }) => (
  <Link
    to={`/projects/${project._id}/epics`}
    className="block bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 hover:scale-105 transition-all border border-gray-700 hover:border-purple-500"
  >
    <div className="flex items-center mb-3">
      <FolderOpen className="text-purple-400 mr-3" size={24} />
      <h3 className="text-lg font-bold truncate">{project.title}</h3>
    </div>
    <p className="text-gray-400 text-sm line-clamp-2 mb-4">
      {project.description || "Sin descripción"}
    </p>
    <div className="flex items-center text-xs text-gray-500">
      <Clock className="mr-1" size={12} />
      Creado {new Date(project.createdAt || project.date).toLocaleDateString()}
    </div>
  </Link>
);

export default HomePage;
