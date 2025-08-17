import React from 'react';
import { Organization } from '../types';

interface OrganizationCardProps {
  organization: Organization;
  onViewProjects: (slug: string) => void;
  onEdit: (organization: Organization) => void;
}

const OrganizationCard: React.FC<OrganizationCardProps> = ({ organization, onViewProjects, onEdit }) => {

  return (
    <div className="card hover:shadow-lg transition-shadow duration-200">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {organization.name}
            </h3>
            <p className="text-sm text-gray-500">
              {organization.contactEmail}
            </p>
          </div>
          <div className="text-2xl">🏢</div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-xl font-bold text-primary-600">
              {organization.projectCount || 0}
            </div>
            <div className="text-xs text-gray-600">Projects</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-xl font-bold text-success-600">
              {organization.activeProjectCount || 0}
            </div>
            <div className="text-xs text-gray-600">Active</div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-2">
          <button 
            onClick={() => onViewProjects(organization.slug)}
            className="btn btn-primary flex-1 hover:bg-primary-700 transition-colors duration-200"
          >
            View Projects
          </button>
          <button 
            onClick={() => onEdit(organization)}
            className="btn btn-secondary hover:bg-gray-600 transition-colors duration-200"
          >
            Edit
          </button>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex justify-between text-xs text-gray-500">
            <span>Created: {new Date(organization.createdAt).toLocaleDateString()}</span>
            <span>Slug: {organization.slug}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationCard;

