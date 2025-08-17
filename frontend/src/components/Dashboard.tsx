import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_ORGANIZATIONS } from '../graphql/queries';
import { Organization } from '../types';
import OrganizationCard from './OrganizationCard';
import CreateOrganizationForm from './CreateOrganizationForm';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import ProjectList from './ProjectList';
import EditOrganizationForm from './EditOrganizationForm';

const Dashboard: React.FC = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingOrganization, setEditingOrganization] = useState<Organization | null>(null);
  const [selectedOrganization, setSelectedOrganization] = useState<string | null>(null);
  const { loading, error, data, refetch } = useQuery(GET_ORGANIZATIONS);

  const handleOrganizationCreated = () => {
    setShowCreateForm(false);
    refetch();
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message="Failed to load organizations" />;

  const organizations = data?.organizations || [];

  // If an organization is selected, show its projects
  if (selectedOrganization) {
    const org = organizations.find((o: any) => o.slug === selectedOrganization);
    if (org) {
      return (
        <ProjectList
          organizationSlug={selectedOrganization}
          organizationName={org.name}
          onBack={() => setSelectedOrganization(null)}
        />
      );
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}

        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Organizations</h2>
              <p className="text-gray-600 text-lg">Manage your project organizations</p>
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="btn btn-primary text-lg px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <span className="mr-2">+</span>
              Create Organization
            </button>
          </div>
        </div>

        {/* Create Organization Form */}
        {showCreateForm && (
          <CreateOrganizationForm
            onSuccess={handleOrganizationCreated}
            onCancel={() => setShowCreateForm(false)}
          />
        )}

        {/* Edit Organization Form */}
        {editingOrganization && (
          <EditOrganizationForm
            organization={editingOrganization}
            onSuccess={() => {
              setEditingOrganization(null);
              refetch();
            }}
            onCancel={() => setEditingOrganization(null)}
          />
        )}

        {/* Organizations Grid */}
        {organizations.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🏢</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No organizations yet
            </h3>
            <p className="text-gray-600 mb-4">
              Create your first organization to get started with project management.
            </p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="btn btn-primary"
            >
              Create Organization
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {organizations.map((organization: Organization) => (
              <OrganizationCard
                key={organization.id}
                organization={organization}
                onViewProjects={(slug) => setSelectedOrganization(slug)}
                onEdit={(org) => setEditingOrganization(org)}
              />
            ))}
          </div>
        )}

        {/* Statistics Summary */}
        {organizations.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">System Overview</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-xl">
                <div className="text-3xl font-bold text-primary-600">
                  {organizations.length}
                </div>
                <div className="text-sm text-gray-600">Organizations</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-xl">
                <div className="text-3xl font-bold text-success-600">
                  {organizations.reduce((sum: number, org: Organization) => sum + (org.projectCount || 0), 0)}
                </div>
                <div className="text-sm text-gray-600">Total Projects</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-xl">
                <div className="text-3xl font-bold text-warning-600">
                  {organizations.reduce((sum: number, org: Organization) => sum + (org.activeProjectCount || 0), 0)}
                </div>
                <div className="text-sm text-gray-600">Active Projects</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-xl">
                <div className="text-3xl font-bold text-gray-600">
                  {organizations.length > 0 ? 'Multi-tenant' : 'Single-tenant'}
                </div>
                <div className="text-sm text-gray-600">Architecture</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

