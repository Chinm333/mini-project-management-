// Organization interface
export interface Organization {
  id: string;
  name: string;
  slug: string;
  contactEmail: string;
  createdAt: string;
  updatedAt: string;
  projectCount?: number;
  activeProjectCount?: number;
}

// Project interface
export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'ACTIVE' | 'COMPLETED' | 'ON_HOLD' | 'CANCELLED';
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  organization: Organization;
  taskCount?: number;
  completedTaskCount?: number;
  completionRate?: number;
  isOverdue?: boolean;
}

// Task interface
export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE';
  assigneeEmail: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  project: Project;
  commentCount?: number;
  isOverdue?: boolean;
}

// Task Comment interface
export interface TaskComment {
  id: string;
  content: string;
  authorEmail: string;
  timestamp: string;
  task: Task;
}

// Organization Statistics interface
export interface OrganizationStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalTasks: number;
  completedTasks: number;
  completionRate: number;
}

// Form interfaces
export interface CreateOrganizationForm {
  name: string;
  contactEmail: string;
}

export interface CreateProjectForm {
  organizationSlug: string;
  name: string;
  description: string;
  status: string;
  dueDate?: string;
}

export interface CreateTaskForm {
  projectId: string;
  title: string;
  description: string;
  status: string;
  assigneeEmail: string;
  dueDate?: string;
}

export interface CreateTaskCommentForm {
  taskId: string;
  content: string;
  authorEmail: string;
}

export interface UpdateTaskStatusForm {
  taskId: string;
  status: string;
}

// API Response interfaces
export interface ApiResponse<T> {
  data?: T;
  success: boolean;
  errors?: string[];
}

// GraphQL Query interfaces
export interface OrganizationsQuery {
  organizations: Organization[];
}

export interface OrganizationQuery {
  organization: Organization;
}

export interface ProjectsQuery {
  projects: Project[];
}

export interface ProjectQuery {
  project: Project;
}

export interface TasksQuery {
  tasks: Task[];
}

export interface TaskQuery {
  task: Task;
}

export interface OrganizationStatsQuery {
  organizationStats: OrganizationStats;
}

// GraphQL Mutation interfaces
export interface CreateOrganizationMutation {
  createOrganization: ApiResponse<Organization>;
}

export interface CreateProjectMutation {
  createProject: ApiResponse<Project>;
}

export interface CreateTaskMutation {
  createTask: ApiResponse<Task>;
}

export interface UpdateTaskStatusMutation {
  updateTaskStatus: ApiResponse<Task>;
}

export interface CreateTaskCommentMutation {
  createTaskComment: ApiResponse<TaskComment>;
}

