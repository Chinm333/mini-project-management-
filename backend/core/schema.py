import graphene
from graphene_django import DjangoObjectType
from django.db.models import Q
from organizations.models import Organization
from projects.models import Project
from tasks.models import Task, TaskComment


# Organization Type
class OrganizationType(DjangoObjectType):
    projectCount = graphene.Int()
    activeProjectCount = graphene.Int()
    
    class Meta:
        model = Organization
        fields = '__all__'
    
    def resolve_projectCount(self, info):
        return self.project_count
    
    def resolve_activeProjectCount(self, info):
        return self.active_project_count


# Project Type
class ProjectType(DjangoObjectType):
    task_count = graphene.Int()
    completed_task_count = graphene.Int()
    completion_rate = graphene.Float()
    is_overdue = graphene.Boolean()

    class Meta:
        model = Project
        fields = '__all__'

    def resolve_task_count(self, info):
        return self.task_count

    def resolve_completed_task_count(self, info):
        return self.completed_task_count

    def resolve_completion_rate(self, info):
        return self.completion_rate

    def resolve_is_overdue(self, info):
        return self.is_overdue


# Task Type
class TaskType(DjangoObjectType):
    comment_count = graphene.Int()
    is_overdue = graphene.Boolean()

    class Meta:
        model = Task
        fields = '__all__'

    def resolve_comment_count(self, info):
        return self.comment_count

    def resolve_is_overdue(self, info):
        return self.is_overdue


# Task Comment Type
class TaskCommentType(DjangoObjectType):
    class Meta:
        model = TaskComment
        fields = '__all__'


# Queries
class Query(graphene.ObjectType):
    # Organization queries
    organizations = graphene.List(OrganizationType)
    organization = graphene.Field(OrganizationType, slug=graphene.String(required=True))
    
    # Project queries
    projects = graphene.List(ProjectType, organization_slug=graphene.String(required=True))
    project = graphene.Field(ProjectType, id=graphene.ID(required=True))
    
    # Task queries
    tasks = graphene.List(TaskType, project_id=graphene.ID(required=True))
    task = graphene.Field(TaskType, id=graphene.ID(required=True))
    
    # Statistics queries
    organization_stats = graphene.Field(
        graphene.JSONString, 
        organization_slug=graphene.String(required=True)
    )

    def resolve_organizations(self, info):
        return Organization.objects.all()

    def resolve_organization(self, info, slug):
        return Organization.objects.filter(slug=slug).first()

    def resolve_projects(self, info, organization_slug):
        try:
            organization = Organization.objects.get(slug=organization_slug)
            return Project.objects.filter(organization=organization)
        except Organization.DoesNotExist:
            return []

    def resolve_project(self, info, id):
        return Project.objects.filter(id=id).first()

    def resolve_tasks(self, info, project_id):
        try:
            project = Project.objects.get(id=project_id)
            return Task.objects.filter(project=project)
        except Project.DoesNotExist:
            return []

    def resolve_task(self, info, id):
        return Task.objects.filter(id=id).first()

    def resolve_organization_stats(self, info, organization_slug):
        try:
            organization = Organization.objects.get(slug=organization_slug)
            projects = Project.objects.filter(organization=organization)
            
            total_projects = projects.count()
            active_projects = projects.filter(status='ACTIVE').count()
            completed_projects = projects.filter(status='COMPLETED').count()
            
            total_tasks = sum(project.task_count for project in projects)
            completed_tasks = sum(project.completed_task_count for project in projects)
            
            completion_rate = 0
            if total_tasks > 0:
                completion_rate = round((completed_tasks / total_tasks) * 100, 1)
            
            return {
                'total_projects': total_projects,
                'active_projects': active_projects,
                'completed_projects': completed_projects,
                'total_tasks': total_tasks,
                'completed_tasks': completed_tasks,
                'completion_rate': completion_rate
            }
        except Organization.DoesNotExist:
            return {}


# Mutations
class CreateOrganization(graphene.Mutation):
    class Arguments:
        name = graphene.String(required=True)
        contact_email = graphene.String(required=True)

    organization = graphene.Field(OrganizationType)
    success = graphene.Boolean()
    errors = graphene.List(graphene.String)

    def mutate(self, info, name, contact_email):
        try:
            organization = Organization.objects.create(
                name=name,
                contact_email=contact_email
            )
            return CreateOrganization(
                organization=organization,
                success=True,
                errors=[]
            )
        except Exception as e:
            return CreateOrganization(
                organization=None,
                success=False,
                errors=[str(e)]
            )


class UpdateOrganization(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)
        name = graphene.String(required=True)
        contact_email = graphene.String(required=True)

    organization = graphene.Field(OrganizationType)
    success = graphene.Boolean()
    errors = graphene.List(graphene.String)

    def mutate(self, info, id, name, contact_email):
        try:
            organization = Organization.objects.get(id=id)
            organization.name = name
            organization.contact_email = contact_email
            organization.save()
            return UpdateOrganization(
                organization=organization,
                success=True,
                errors=[]
            )
        except Organization.DoesNotExist:
            return UpdateOrganization(
                organization=None,
                success=False,
                errors=["Organization not found"]
            )
        except Exception as e:
            return UpdateOrganization(
                organization=None,
                success=False,
                errors=[str(e)]
            )


class CreateProject(graphene.Mutation):
    class Arguments:
        organization_slug = graphene.String(required=True)
        name = graphene.String(required=True)
        description = graphene.String()
        status = graphene.String()
        due_date = graphene.Date()

    project = graphene.Field(ProjectType)
    success = graphene.Boolean()
    errors = graphene.List(graphene.String)

    def mutate(self, info, organization_slug, name, description="", status="ACTIVE", due_date=None):
        try:
            organization = Organization.objects.get(slug=organization_slug)
            project = Project.objects.create(
                organization=organization,
                name=name,
                description=description,
                status=status,
                due_date=due_date
            )
            return CreateProject(
                project=project,
                success=True,
                errors=[]
            )
        except Organization.DoesNotExist:
            return CreateProject(
                project=None,
                success=False,
                errors=["Organization not found"]
            )
        except Exception as e:
            return CreateProject(
                project=None,
                success=False,
                errors=[str(e)]
            )


class CreateTask(graphene.Mutation):
    class Arguments:
        project_id = graphene.ID(required=True)
        title = graphene.String(required=True)
        description = graphene.String()
        status = graphene.String()
        assignee_email = graphene.String()
        due_date = graphene.DateTime()

    task = graphene.Field(TaskType)
    success = graphene.Boolean()
    errors = graphene.List(graphene.String)

    def mutate(self, info, project_id, title, description="", status="TODO", assignee_email="", due_date=None):
        try:
            project = Project.objects.get(id=project_id)
            task = Task.objects.create(
                project=project,
                title=title,
                description=description,
                status=status,
                assignee_email=assignee_email,
                due_date=due_date
            )
            return CreateTask(
                task=task,
                success=True,
                errors=[]
            )
        except Project.DoesNotExist:
            return CreateTask(
                task=None,
                success=False,
                errors=["Project not found"]
            )
        except Exception as e:
            return CreateTask(
                task=None,
                success=False,
                errors=[str(e)]
            )


class UpdateTaskStatus(graphene.Mutation):
    class Arguments:
        task_id = graphene.ID(required=True)
        status = graphene.String(required=True)

    task = graphene.Field(TaskType)
    success = graphene.Boolean()
    errors = graphene.List(graphene.String)

    def mutate(self, info, task_id, status):
        try:
            task = Task.objects.get(id=task_id)
            task.status = status
            task.save()
            return UpdateTaskStatus(
                task=task,
                success=True,
                errors=[]
            )
        except Task.DoesNotExist:
            return UpdateTaskStatus(
                task=None,
                success=False,
                errors=["Task not found"]
            )
        except Exception as e:
            return UpdateTaskStatus(
                task=None,
                success=False,
                errors=[str(e)]
            )


class CreateTaskComment(graphene.Mutation):
    class Arguments:
        task_id = graphene.ID(required=True)
        content = graphene.String(required=True)
        author_email = graphene.String(required=True)

    comment = graphene.Field(TaskCommentType)
    success = graphene.Boolean()
    errors = graphene.List(graphene.String)

    def mutate(self, info, task_id, content, author_email):
        try:
            task = Task.objects.get(id=task_id)
            comment = TaskComment.objects.create(
                task=task,
                content=content,
                author_email=author_email
            )
            return CreateTaskComment(
                comment=comment,
                success=True,
                errors=[]
            )
        except Task.DoesNotExist:
            return CreateTaskComment(
                comment=None,
                success=False,
                errors=["Task not found"]
            )
        except Exception as e:
            return CreateTaskComment(
                comment=None,
                success=False,
                errors=[str(e)]
            )


class Mutation(graphene.ObjectType):
    create_organization = CreateOrganization.Field()
    update_organization = UpdateOrganization.Field()
    create_project = CreateProject.Field()
    create_task = CreateTask.Field()
    update_task_status = UpdateTaskStatus.Field()
    create_task_comment = CreateTaskComment.Field()


# Create the schema
schema = graphene.Schema(query=Query, mutation=Mutation)

