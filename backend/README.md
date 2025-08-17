# Project Management System - Backend

This is the Django backend for the Project Management System, featuring a GraphQL API with multi-tenant architecture.

## Features

- **Multi-tenant Architecture**: Organization-based data isolation
- **GraphQL API**: Modern API with efficient data fetching
- **Django Models**: Organizations, Projects, Tasks, and Comments
- **Admin Interface**: Built-in Django admin for data management
- **REST Framework**: Additional REST endpoints for flexibility

## Tech Stack

- Django 4.2.7
- Django REST Framework
- GraphQL (Graphene-Django)
- PostgreSQL
- Django CORS Headers

## Quick Start

### Prerequisites

- Python 3.8+
- PostgreSQL database
- Virtual environment (recommended)

### Installation

1. **Create Virtual Environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Database Setup**
   ```bash
   # Create PostgreSQL database
   createdb project_management
   
   # Update database settings in core/settings.py if needed
   ```

4. **Run Setup Script**
   ```bash
   python setup.py
   ```

5. **Start Development Server**
   ```bash
   python manage.py runserver
   ```

## API Endpoints

### GraphQL
- **URL**: `http://localhost:8000/graphql/`
- **GraphiQL Interface**: `http://localhost:8000/graphql/`

### Admin Interface
- **URL**: `http://localhost:8000/admin/`

## Testing

### Test Models
```bash
python test_models.py
```

### Run Django Tests
```bash
python manage.py test
```

## Project Structure

```
backend/
├── core/                   # Main Django project
│   ├── settings.py        # Django settings
│   ├── urls.py           # URL configuration
│   ├── schema.py         # GraphQL schema
│   └── wsgi.py           # WSGI configuration
├── organizations/         # Organization app
│   ├── models.py         # Organization model
│   └── admin.py          # Admin interface
├── projects/             # Project app
│   ├── models.py         # Project model
│   └── admin.py          # Admin interface
├── tasks/                # Task app
│   ├── models.py         # Task and TaskComment models
│   └── admin.py          # Admin interface
├── manage.py             # Django management script
├── setup.py              # Setup script
├── test_models.py        # Model testing script
└── requirements.txt      # Python dependencies
```

## Data Models

### Organization
- `name`: Organization name
- `slug`: URL-friendly identifier
- `contact_email`: Contact email address
- `created_at`, `updated_at`: Timestamps

### Project
- `organization`: Foreign key to Organization
- `name`: Project name
- `description`: Project description
- `status`: Project status (ACTIVE, COMPLETED, ON_HOLD, CANCELLED)
- `due_date`: Project due date
- `created_at`, `updated_at`: Timestamps

### Task
- `project`: Foreign key to Project
- `title`: Task title
- `description`: Task description
- `status`: Task status (TODO, IN_PROGRESS, REVIEW, DONE)
- `assignee_email`: Assignee email
- `due_date`: Task due date
- `created_at`, `updated_at`: Timestamps

### TaskComment
- `task`: Foreign key to Task
- `content`: Comment content
- `author_email`: Author email
- `timestamp`: Comment timestamp

## GraphQL Schema

The GraphQL schema provides:

### Queries
- `organizations`: List all organizations
- `organization(slug)`: Get organization by slug
- `projects(organizationSlug)`: List projects for organization
- `project(id)`: Get project by ID
- `tasks(projectId)`: List tasks for project
- `task(id)`: Get task by ID
- `organizationStats(organizationSlug)`: Get organization statistics

### Mutations
- `createOrganization`: Create new organization
- `createProject`: Create new project
- `createTask`: Create new task
- `updateTaskStatus`: Update task status
- `createTaskComment`: Create task comment

## Multi-tenancy

The system implements organization-based multi-tenancy:
- All data is isolated by organization
- API endpoints require organization context
- Data separation is enforced at the database level
- Organizations are completely isolated from each other

## Development

### Adding New Features
1. Create/update models in the appropriate app
2. Update GraphQL schema in `core/schema.py`
3. Add admin interfaces if needed
4. Test with `test_models.py`
5. Create and run migrations

### Code Style
- Follow Django best practices
- Use PEP 8 for Python code
- Add docstrings to all functions and classes
- Include type hints where appropriate

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Ensure PostgreSQL is running
   - Check database credentials in `core/settings.py`
   - Verify database exists

2. **Import Errors**
   - Ensure virtual environment is activated
   - Check Python path and Django setup

3. **Migration Issues**
   - Delete migration files and recreate if needed
   - Ensure all apps are in `INSTALLED_APPS`

## Next Steps

- [ ] Add user authentication
- [ ] Implement role-based permissions
- [ ] Add file upload support
- [ ] Create comprehensive test suite
- [ ] Add API rate limiting
- [ ] Implement caching
- [ ] Add monitoring and logging

