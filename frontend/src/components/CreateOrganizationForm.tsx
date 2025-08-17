import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_ORGANIZATION } from '../graphql/mutations';
import { CreateOrganizationForm as CreateOrganizationFormType } from '../types';

interface CreateOrganizationFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const CreateOrganizationForm: React.FC<CreateOrganizationFormProps> = ({
  onSuccess,
  onCancel,
}) => {
  const [formData, setFormData] = useState<CreateOrganizationFormType>({
    name: '',
    contactEmail: '',
  });

  const [errors, setErrors] = useState<string[]>([]);

  const [createOrganization, { loading }] = useMutation(CREATE_ORGANIZATION, {
    onCompleted: (data) => {
      if (data.createOrganization.success) {
        onSuccess();
      } else {
        setErrors(data.createOrganization.errors || []);
      }
    },
    onError: (error) => {
      setErrors([error.message]);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);

    // Basic validation
    if (!formData.name.trim()) {
      setErrors(['Organization name is required']);
      return;
    }

    if (!formData.contactEmail.trim()) {
      setErrors(['Contact email is required']);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.contactEmail)) {
      setErrors(['Please enter a valid email address']);
      return;
    }

    createOrganization({
      variables: {
        name: formData.name.trim(),
        contactEmail: formData.contactEmail.trim(),
      },
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="card">
      <div className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Create New Organization
        </h3>

        {/* Error Messages */}
        {errors.length > 0 && (
          <div className="mb-4">
            {errors.map((error, index) => (
              <div
                key={index}
                className="text-danger-600 text-sm mb-2 p-2 bg-danger-50 border border-danger-200 rounded"
              >
                {error}
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Organization Name */}
          <div>
            <label htmlFor="name" className="label">
              Organization Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="input"
              placeholder="Enter organization name"
              required
            />
          </div>

          {/* Contact Email */}
          <div>
            <label htmlFor="contactEmail" className="label">
              Contact Email *
            </label>
            <input
              type="email"
              id="contactEmail"
              name="contactEmail"
              value={formData.contactEmail}
              onChange={handleChange}
              className="input"
              placeholder="Enter contact email"
              required
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="btn btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Organization'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateOrganizationForm;

