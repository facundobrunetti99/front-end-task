import React from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import RegisterPage from "./page/RegisterPage";
import LoginPage from "./page/LoginPage";
import { AuthProvider } from "../src/components/context/AuthContext";
import { TaskProvider } from "../src/components/context/TaskContext";
import ProjectFormPage from "./page/ProjectFormPage";
import ProjectPage from "./page/ProjectPage";
import TaskPage from "../src/page/TaskPage";
import TaskFormPage from "../src/page/TaskFormPage";
import HomePage from "../src/page/HomePage";
import ProtectedRoute from "./ProtectedRoute";
import Navbar from "../src/components/Navbar";
import EpicFormPage from "./page/EpicFormPage";
import EpicPage from "./page/EpicPage";
import StoryFormPage from "./page/StoryFormPage";
import StoryPage from "./page/StoryPage";
import { ProjectProvider } from "./components/context/ProjectContext";
import { EpicProvider } from "./components/context/EpicContext";
import { StoryProvider } from "./components/context/StoryContext";

const App = () => {
  return (
    <AuthProvider>
      <ProjectProvider>
        <EpicProvider>
          <StoryProvider>
            <TaskProvider>
              <BrowserRouter>
                <Navbar></Navbar>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route element={<ProtectedRoute />}>
                    <Route path="/project" element={<ProjectFormPage />} />
                    <Route path="/projects" element={<ProjectPage />} />
                    <Route path="/project/:id" element={<ProjectFormPage />} />

                    <Route
                      path="/projects/:projectId/epics"
                      element={<EpicPage />}
                    />
                    <Route
                      path="/projects/:projectId/epics/new"
                      element={<EpicFormPage />}
                    />
                    <Route
                      path="/projects/:projectId/epics/:id"
                      element={<EpicFormPage />}
                    />

                    <Route
                      path="/projects/:projectId/epics/:epicId/stories"
                      element={<StoryPage />}
                    />
                    <Route
                      path="/projects/:projectId/epics/:epicId/story"
                      element={<StoryFormPage />}
                    />
                    <Route
                      path="/projects/:projectId/epics/:epicId/story/:id"
                      element={<StoryFormPage />}
                    />

                    <Route
                      path="/projects/:projectId/epics/:epicId/stories/:storyId/tasks"
                      element={<TaskPage />}
                    />
                    <Route
                      path="/projects/:projectId/epics/:epicId/stories/:storyId/task"
                      element={<TaskFormPage />}
                    />
                    <Route
                      path="/projects/:projectId/epics/:epicId/stories/:storyId/task/:id"
                      element={<TaskFormPage />}
                    />
                  </Route>
                </Routes>
              </BrowserRouter>
            </TaskProvider>
          </StoryProvider>
        </EpicProvider>
      </ProjectProvider>
    </AuthProvider>
  );
};

export default App;
