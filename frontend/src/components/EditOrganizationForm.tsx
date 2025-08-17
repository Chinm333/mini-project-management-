import React, { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { UPDATE_ORGANIZATION } from '../graphql/mutations';
import { Organization } from '../types';

interface EditOrganizationFormProps {
  organization: Organization;
  onSuccess: () => void;
  onCancel: () => void;
}

const EditOrganizationForm: React.FC<EditOrganizationFormProps> = ({ 
  organization, 
  onSuccess, 
  onCancel 
}) => {
  const [formData, setFormData] = useState({
    name: organization.name,
    contactEmail: organization.contactEmail
  });

  const [updateOrganization] = useMutation(UPDATE_ORGANIZATION, {
    onCompleted: () => {
      onSuccess();
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateOrganization({
      variables: {
        id: organization.id,
        name: formData.name,
        contactEmail: formData.contactEmail
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Edit Organization</h3>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="label">Organization Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="input"
              required
            />
          </div>
          
          <div>
            <label className="label">Contact Email *</label>
            <input
              type="email"
              value={formData.contactEmail}
              onChange={(e) => setFormData({...formData, contactEmail: e.target.value})}
              className="input"
              required
            />
          </div>
          
          <div className="flex space-x-3 pt-4">
            <button type="submit" className="btn btn-primary flex-1">
              Update Organization
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="btn btn-secondary flex-1"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditOrganizationForm;
