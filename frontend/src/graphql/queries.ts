import { gql } from '@apollo/client';

// Organization queries
export const GET_ORGANIZATIONS = gql`
  query GetOrganizations {
    organizations {
      id
      name
      slug
      contactEmail
      createdAt
      updatedAt
      projectCount
      activeProjectCount
    }
  }
`;

export const GET_ORGANIZATION = gql`
  query GetOrganization($slug: String!) {
    organization(slug: $slug) {
      id
      name
      slug
      contactEmail
      createdAt
      updatedAt
      projectCount
      activeProjectCount
    }
  }
`;

// Project queries
export const GET_PROJECTS = gql`
  query GetProjects($organizationSlug: String!) {
    projects(organizationSlug: $organizationSlug) {
      id
      name
      description
      status
      dueDate
      createdAt
      updatedAt
      organization {
        id
        name
        slug
      }
      taskCount
      completedTaskCount
      completionRate
      isOverdue
    }
  }
`;

export const GET_PROJECT = gql`
  query GetProject($id: ID!) {
    project(id: $id) {
      id
      name
      description
      status
      dueDate
      createdAt
      updatedAt
      organization {
        id
        name
        slug
      }
      taskCount
      completedTaskCount
      completionRate
      isOverdue
    }
  }
`;

// Task queries
export const GET_TASKS = gql`
  query GetTasks($projectId: ID!) {
    tasks(projectId: $projectId) {
      id
      title
      description
      status
      assigneeEmail
      dueDate
      createdAt
      updatedAt
      project {
        id
        name
        organization {
          id
          name
          slug
        }
      }
      commentCount
      isOverdue
    }
  }
`;

export const GET_TASK = gql`
  query GetTask($id: ID!) {
    task(id: $id) {
      id
      title
      description
      status
      assigneeEmail
      dueDate
      createdAt
      updatedAt
      project {
        id
        name
        organization {
          id
          name
          slug
        }
      }
      commentCount
      isOverdue
    }
  }
`;

// Statistics queries
export const GET_ORGANIZATION_STATS = gql`
  query GetOrganizationStats($organizationSlug: String!) {
    organizationStats(organizationSlug: $organizationSlug)
  }
`;

export const CREATE_PROJECT = gql`
  mutation CreateProject(
    $organizationSlug: String!
    $name: String!
    $description: String
    $status: String
    $dueDate: Date
  ) {
    createProject(
      organizationSlug: $organizationSlug
      name: $name
      description: $description
      status: $status
      dueDate: $dueDate
    ) {
      success
      errors
      project {
        id
        name
        description
        status
        dueDate
        createdAt
        updatedAt
        organization {
          id
          name
          slug
        }
      }
    }
  }
`;

