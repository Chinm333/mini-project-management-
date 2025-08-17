# Mini Project Management System

A multi-tenant project management tool built with Django + GraphQL backend and React + TypeScript frontend.

## Features

- **Multi-tenant Architecture**: Organization-based data isolation
- **Project Management**: Create, update, and track projects
- **Task Management**: Assign tasks, update status, add comments
- **GraphQL API**: Modern API with efficient data fetching
- **Responsive UI**: Built with React, TypeScript, and TailwindCSS

## Tech Stack

### Backend
- Django 4.2.7
- Django REST Framework
- GraphQL (Graphene-Django)
- PostgreSQL
- Django CORS Headers

### Frontend
- React 18+
- TypeScript
- Apollo Client
- TailwindCSS

## Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- PostgreSQL
- Docker (optional)

### Backend Setup

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
   
   # Run migrations
   python manage.py migrate
   
   # Create superuser
   python manage.py createsuperuser
   ```

4. **Start Backend Server**
   ```bash
   python manage.py runserver
   ```

### Frontend Setup

1. **Install Dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm start
   ```

## API Documentation

### GraphQL Endpoint
- **URL**: `http://localhost:8000/graphql/`
- **GraphiQL Interface**: `http://localhost:8000/graphql/`

### Key Queries
- `organizations`: List all organizations
- `projects`: List projects for an organization
- `tasks`: List tasks for a project

### Key Mutations
- `createOrganization`: Create new organization
- `createProject`: Create new project
- `createTask`: Create new task
- `updateTaskStatus`: Update task status

## Project Structure

```
mini-project-management-system/
├── backend/                 # Django backend
│   ├── core/               # Core Django settings
│   ├── organizations/      # Organization app
│   ├── projects/          # Project app
│   ├── tasks/             # Task app
│   └── manage.py
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── graphql/       # GraphQL queries/mutations
│   │   └── types/         # TypeScript interfaces
│   └── package.json
├── requirements.txt        # Python dependencies
└── README.md
```

## Multi-tenancy

The system implements organization-based multi-tenancy:
- All data is isolated by organization
- Users can belong to multiple organizations
- API endpoints require organization context
- Data separation is enforced at the database level

## Development

### Running Tests
```bash
# Backend tests
python manage.py test

# Frontend tests
cd frontend
npm test
```

### Code Quality
- Backend: Django best practices, PEP 8
- Frontend: ESLint, Prettier, TypeScript strict mode

## Future Improvements

- Real-time updates with WebSockets
- Advanced filtering and search
- Mobile-responsive design
- Performance optimizations
- Comprehensive testing suite
- Docker containerization
- CI/CD pipeline

## License

MIT License

