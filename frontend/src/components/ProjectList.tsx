import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_PROJECTS, CREATE_PROJECT } from '../graphql/queries';
import { Project } from '../types';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

interface ProjectListProps {
  organizationSlug: string;
  organizationName: string;
  onBack: () => void;
}

const ProjectList: React.FC<ProjectListProps> = ({ organizationSlug, organizationName, onBack }) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'ACTIVE',
    dueDate: ''
  });

  const { loading, error, data, refetch } = useQuery(GET_PROJECTS, {
    variables: { organizationSlug }
  });

  const [createProject] = useMutation(CREATE_PROJECT, {
    onCompleted: () => {
      setShowCreateForm(false);
      setFormData({ name: '', description: '', status: 'ACTIVE', dueDate: '' });
      refetch();
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createProject({
      variables: {
        organizationSlug,
        name: formData.name,
        description: formData.description,
        status: formData.status,
        dueDate: formData.dueDate || null
      }
    });
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message="Failed to load projects" />;

  const projects = data?.projects || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <button 
            onClick={onBack}
            className="text-primary-600 hover:text-primary-800 mb-2"
          >
            ← Back to Organizations
          </button>
          <h2 className="text-2xl font-bold text-gray-900">{organizationName} - Projects</h2>
          <p className="text-gray-600">Manage projects for this organization</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="btn btn-primary"
        >
          Create Project
        </button>
      </div>

      {/* Create Project Form */}
      {showCreateForm && (
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Create New Project</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Project Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="input"
                required
              />
            </div>
            <div>
              <label className="label">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="input"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="input"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="ON_HOLD">On Hold</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </div>
              <div>
                <label className="label">Due Date</label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                  className="input"
                />
              </div>
            </div>
            <div className="flex space-x-3">
              <button type="submit" className="btn btn-primary">
                Create Project
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Projects List */}
      {projects.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📁</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No projects yet
          </h3>
          <p className="text-gray-600 mb-4">
            Create your first project to get started with task management.
          </p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="btn btn-primary"
          >
            Create Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project: Project) => (
            <div key={project.id} className="card hover:shadow-lg transition-shadow duration-200">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {project.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">
                      {project.description || 'No description'}
                    </p>
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                      project.status === 'ACTIVE' ? 'bg-success-100 text-success-800' :
                      project.status === 'COMPLETED' ? 'bg-primary-100 text-primary-800' :
                      'bg-warning-100 text-warning-800'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                  <div className="text-2xl">📁</div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-xl font-bold text-primary-600">
                      {project.taskCount || 0}
                    </div>
                    <div className="text-xs text-gray-600">Tasks</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-xl font-bold text-success-600">
                      {project.completionRate || 0}%
                    </div>
                    <div className="text-xs text-gray-600">Complete</div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button className="btn btn-primary flex-1">
                    View Tasks
                  </button>
                  <button className="btn btn-secondary">
                    Edit
                  </button>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Created: {new Date(project.createdAt).toLocaleDateString()}</span>
                    {project.dueDate && (
                      <span>Due: {new Date(project.dueDate).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectList;
