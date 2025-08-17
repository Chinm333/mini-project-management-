import { gql } from '@apollo/client';

// Organization mutations
export const CREATE_ORGANIZATION = gql`
  mutation CreateOrganization($name: String!, $contactEmail: String!) {
    createOrganization(name: $name, contactEmail: $contactEmail) {
      success
      errors
      organization {
        id
        name
        slug
        contactEmail
        createdAt
        updatedAt
      }
    }
  }
`;

// Project mutations
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

// Task mutations
export const CREATE_TASK = gql`
  mutation CreateTask(
    $projectId: ID!
    $title: String!
    $description: String
    $status: String
    $assigneeEmail: String
    $dueDate: DateTime
  ) {
    createTask(
      projectId: $projectId
      title: $title
      description: $description
      status: $status
      assigneeEmail: $assigneeEmail
      dueDate: $dueDate
    ) {
      success
      errors
      task {
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
      }
    }
  }
`;

export const UPDATE_TASK_STATUS = gql`
  mutation UpdateTaskStatus($taskId: ID!, $status: String!) {
    updateTaskStatus(taskId: $taskId, status: $status) {
      success
      errors
      task {
        id
        title
        status
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
      }
    }
  }
`;

// Task Comment mutations
export const CREATE_TASK_COMMENT = gql`
  mutation CreateTaskComment(
    $taskId: ID!
    $content: String!
    $authorEmail: String!
  ) {
    createTaskComment(
      taskId: $taskId
      content: $content
      authorEmail: $authorEmail
    ) {
      success
      errors
      comment {
        id
        content
        authorEmail
        timestamp
        task {
          id
          title
          project {
            id
            name
            organization {
              id
              name
              slug
            }
          }
        }
      }
    }
  }
`;

export const UPDATE_ORGANIZATION = gql`
  mutation UpdateOrganization($id: ID!, $name: String!, $contactEmail: String!) {
    updateOrganization(id: $id, name: $name, contactEmail: $contactEmail) {
      success
      errors
      organization {
        id
        name
        contactEmail
        slug
        createdAt
        updatedAt
      }
    }
  }
`;

