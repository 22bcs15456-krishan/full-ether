import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTasks, createTask, getProjects, createProject } from "../api";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState("");
  const [projectError, setProjectError] = useState("");
  const [loading, setLoading] = useState(true);
  const [newTask, setNewTask] = useState({ title: "", description: "" });
  const [newProject, setNewProject] = useState({ title: "", description: "" });
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");
  const [projectSubmitError, setProjectSubmitError] = useState("");
  const [projectSuccess, setProjectSuccess] = useState("");
  const navigate = useNavigate();

  const fetchTasks = async (token) => {
    try {
      const res = await getTasks(token);
      setTasks(res.data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to load tasks");
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/");
      }
    }
  };

  const fetchProjects = async (token) => {
    try {
      const res = await getProjects(token);
      setProjects(res.data);
      setProjectError("");
    } catch (err) {
      setProjectError(err.response?.data?.msg || "Failed to load projects");
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/");
      }
    }
  };

  const getToken = () => localStorage.getItem("token");

  const fetchData = async () => {
    const token = getToken();
    if (!token) {
      navigate("/");
      return;
    }

    setLoading(true);
    await Promise.all([fetchTasks(token), fetchProjects(token)]);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [navigate]);

  const handleCreateTask = async (event) => {
    event.preventDefault();
    setSubmitError("");
    setSubmitSuccess("");

    if (!newTask.title.trim()) {
      setSubmitError("Title is required.");
      return;
    }

    const token = getToken();
    if (!token) {
      navigate("/");
      return;
    }

    try {
      await createTask(newTask, token);
      setSubmitSuccess("Task created successfully.");
      setNewTask({ title: "", description: "" });
      await fetchTasks(token);
    } catch (err) {
      setSubmitError(err.response?.data?.msg || "Failed to create task");
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/");
      }
    }
  };

  const handleCreateProject = async (event) => {
    event.preventDefault();
    setProjectSubmitError("");
    setProjectSuccess("");

    if (!newProject.title.trim()) {
      setProjectSubmitError("Project title is required.");
      return;
    }

    const token = getToken();
    if (!token) {
      navigate("/");
      return;
    }

    try {
      await createProject(newProject, token);
      setProjectSuccess("Project created successfully.");
      setNewProject({ title: "", description: "" });
      await fetchProjects(token);
    } catch (err) {
      setProjectSubmitError(err.response?.data?.msg || "Failed to create project");
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/");
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Dashboard</h2>
      <button onClick={handleLogout}>Logout</button>

      <section style={{ marginTop: "16px" }}>
        <h3>Projects</h3>
        {projectError && <p style={{ color: "red" }}>{projectError}</p>}
        {projectSubmitError && <p style={{ color: "red" }}>{projectSubmitError}</p>}
        {projectSuccess && <p style={{ color: "green" }}>{projectSuccess}</p>}
        <form onSubmit={handleCreateProject} style={{ marginBottom: "16px" }}>
          <input
            placeholder="Project title"
            value={newProject.title}
            onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
          />
          <input
            placeholder="Project description"
            value={newProject.description}
            onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
          />
          <button type="submit">Create Project</button>
        </form>
        {projects.length === 0 ? (
          <p>No projects found.</p>
        ) : (
          projects.map((project) => (
            <div key={project._id} style={{ marginBottom: "8px" }}>
              <strong>{project.title}</strong>
              <p>{project.description || "No description"}</p>
            </div>
          ))
        )}
      </section>

      <section style={{ marginTop: "32px" }}>
        <h3>Tasks</h3>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <div style={{ marginTop: "16px", marginBottom: "16px" }}>
          <h4>Create New Task</h4>
          {submitError && <p style={{ color: "red" }}>{submitError}</p>}
          {submitSuccess && <p style={{ color: "green" }}>{submitSuccess}</p>}
          <form onSubmit={handleCreateTask}>
            <input
              placeholder="Task title"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            />
            <input
              placeholder="Task description"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            />
            <button type="submit">Add Task</button>
          </form>
        </div>
        {tasks.length === 0 ? (
          <p>No tasks found.</p>
        ) : (
          tasks.map((t) => (
            <p key={t._id}>
              {t.title} - {t.status}
            </p>
          ))
        )}
      </section>
    </div>
  );
}