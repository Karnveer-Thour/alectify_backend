import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrganizationType } from '../../organizations/entities/organization-type.entity';
import { Project } from '../../projects/entities/project.entity';
import { Role } from './role.entity';
import { User } from './user.entity';
import { SubProject } from 'modules/projects/entities/sub-project.entity';

@Entity('permissions')
// @Index('permissions_pkey', ['id'], { unique: true })
@Index('permissions_org_type_id_cf8e1269', ['organizationType'], {})
@Index('permissions_project_id_fb18d3f3', ['subProject'], {})
@Index('permissions_role_id_cf87720b', ['role'], {})
@Index('permissions_user_id_b26c2228', ['user'], {})
export class Permission {
  @Column({ primary: true, name: 'id', type: 'uuid' })
  id: string;

  @Column({ name: 'can_view_dashboard', type: 'boolean' })
  canViewDashboard: boolean;

  @Column({ name: 'can_add_project', type: 'boolean' })
  canAddProject: boolean;

  @Column({ name: 'can_edit_project', type: 'boolean' })
  canEditProject: boolean;

  @Column({ name: 'can_delete_project', type: 'boolean' })
  canDeleteProject: boolean;

  @Column({ name: 'can_add_project_document', type: 'boolean' })
  canAddProjectDocument: boolean;

  @Column({ name: 'can_edit_project_document', type: 'boolean' })
  canEditProjectDocument: boolean;

  @Column({ name: 'can_delete_project_document', type: 'boolean' })
  canDeleteProjectDocument: boolean;

  @Column({ name: 'can_download_project_document', type: 'boolean' })
  canDownloadProjectDocument: boolean;

  @Column({ name: 'can_view_analytics', type: 'boolean' })
  canViewAnalytics: boolean;

  @Column({ name: 'can_view_master_tags', type: 'boolean' })
  canViewMasterTags: boolean;

  @Column({ name: 'can_view_insights', type: 'boolean' })
  canViewInsights: boolean;

  @Column({ name: 'can_view_project_document', type: 'boolean' })
  canViewProjectDocument: boolean;

  @Column({ name: 'can_edit_master_tags', type: 'boolean' })
  canEditMasterTags: boolean;

  @Column({ name: 'can_delete_master_tags', type: 'boolean' })
  canDeleteMasterTags: boolean;

  @Column({ name: 'can_view_singlelines', type: 'boolean' })
  canViewSinglelines: boolean;

  @Column({ name: 'can_edit_singlelines', type: 'boolean' })
  canEditSinglelines: boolean;

  @Column({ name: 'can_delete_singlelines', type: 'boolean' })
  canDeleteSinglelines: boolean;

  @Column({ name: 'can_add_packages', type: 'boolean' })
  canAddPackages: boolean;

  @Column({ name: 'can_edit_packages', type: 'boolean' })
  canEditPackages: boolean;

  @Column({ name: 'can_view_packages', type: 'boolean' })
  canViewPackages: boolean;

  @Column({ name: 'can_delete_packages', type: 'boolean' })
  canDeletePackages: boolean;

  @Column({ name: 'can_view_searchbar', type: 'boolean' })
  canViewSearchbar: boolean;

  @Column({ name: 'can_view_workflow', type: 'boolean' })
  canViewWorkflow: boolean;

  @Column({ name: 'can_add_workflow', type: 'boolean' })
  canAddWorkflow: boolean;

  @Column({ name: 'can_delete_workflow', type: 'boolean' })
  canDeleteWorkflow: boolean;

  @Column({ name: 'can_edit_workflow', type: 'boolean' })
  canEditWorkflow: boolean;

  @Column({ name: 'can_view_deadlines', type: 'boolean' })
  canViewDeadlines: boolean;

  @Column({ name: 'can_view_pm_external', type: 'boolean' })
  canViewPmExternal: boolean;

  @Column({ name: 'can_view_pm_internal', type: 'boolean' })
  canViewPmInternal: boolean;

  @Column({ name: 'can_add_sparepart', type: 'boolean' })
  canAddSparepart: boolean;

  @Column({ name: 'can_delete_sparepart', type: 'boolean' })
  canDeleteSparepart: boolean;

  @Column({ name: 'can_edit_sparepart', type: 'boolean' })
  canEditSparepart: boolean;

  @Column({ name: 'can_view_sparepart', type: 'boolean' })
  canViewSparepart: boolean;

  @ManyToOne(
    () => OrganizationType,
    (organizationType) => organizationType.permissions,
  )
  @JoinColumn([{ name: 'org_type_id', referencedColumnName: 'id' }])
  organizationType: OrganizationType;

  @ManyToOne(() => SubProject, (subProject) => subProject.permissions, {
    nullable: false,
  })
  @JoinColumn([{ name: 'project_id', referencedColumnName: 'id' }])
  subProject: SubProject;

  @ManyToOne(() => Role, (role) => role.permissions)
  @JoinColumn([{ name: 'role_id', referencedColumnName: 'id' }])
  role: Role;

  @ManyToOne(() => User, (user) => user.permissions, {
    nullable: false,
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;

  @Column({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;
}
