import { S3 } from '@common/helpers/s3';
import { MasterPreventiveMaintenanceAssignees } from 'modules/preventive-maintenance-assignees/entities/master-preventive-maintenance-assignees.entity';
import { ProcedureSteps } from 'modules/procedures/entities/procedure-steps-entity';
import { ProceduresLibrary } from 'modules/procedures/entities/procedures-library-entity';
import { ProjectAccount } from 'modules/projects/entities/project-account.entity';
import { Project } from 'modules/projects/entities/project.entity';
import { SubProject } from 'modules/projects/entities/sub-project.entity';
import {
  AfterLoad,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Comment } from '../../comments/entities//comment.entity';
import { Organization } from '../../organizations/entities/organization.entity';
import { PreventiveMaintenanceAssignees } from '../../preventive-maintenance-assignees/entities/preventive-maintenance-assignees.entity';
import { PreventiveMaintenanceDocuments } from '../../preventive-maintenance-documents/entities/preventive-maintenance-documents.entity';
import { Branch } from './branch.entity';
import { DjangoAdminLog } from './django-admin-log.entity';
import { Permission } from './permission.entity';
import { UserContact } from './user-contact.entity';
import { UserFcmToken } from './user-fcm-token.entity';
import { UserGroup } from './user-group.entity';
import { UserUserPermission } from './user-user-permission.entity';
import { ProjectTeamMembers } from 'modules/projects/entities/project-team-members.entity';

const {
  env: {
    AWS_S3_BUCKET_NAME,
    AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY,
    AWS_S3_REGION,
  },
} = process;

const s3 = new S3(AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_S3_REGION);

@Entity('authentication_user')
@Index('authentication_user_branch_id_fd655de6', ['branch'], {})
@Index('authentication_user_email_2220eff5_like', ['email'], {})
// @Index('authentication_user_email_key', ['email'], { unique: true })
// @Index('authentication_user_pkey', ['id'], { unique: true })
export class User {
  @Column({ primary: true, name: 'id', type: 'uuid' })
  id: string;

  @Column({ name: 'password', type: 'varchar', length: 128, select: false })
  password: string;

  @Column({
    name: 'last_login',
    type: 'timestamp with time zone',
    nullable: true,
  })
  lastLogin: Date;

  @Column({ name: 'is_superuser', type: 'boolean' })
  isSuperuser: boolean;

  @Column({ name: 'username', type: 'varchar', nullable: true, length: 150 })
  username: string;

  @Column({ name: 'first_name', type: 'varchar', length: 150 })
  first_name: string;

  @Column({ name: 'last_name', type: 'varchar', length: 150 })
  last_name: string;

  @Column({ name: 'email', type: 'varchar', length: 254, unique: true })
  email: string;

  @Column({ name: 'is_staff', type: 'boolean' })
  isStaff: boolean;

  @Column({ name: 'is_branch_admin', type: 'boolean', nullable: true })
  isBranchAdmin: boolean;

  @Column({ name: 'is_active', type: 'boolean' })
  isActive: boolean;

  @Column({ name: 'date_joined', type: 'timestamp with time zone' })
  dateJoined: Date;

  @Column({ name: 'image_url', type: 'varchar', length: 255, nullable: true })
  image_url: string;

  @Column({ name: 'email_verified', type: 'boolean' })
  emailVerified: boolean;

  @Column({
    name: 'contact_number',
    type: 'varchar',
    nullable: true,
    length: 16,
  })
  contactNumber: string;

  @Column({
    name: 'user_type',
    type: 'int',
    nullable: true,
  })
  user_type: number;

  @Column({ name: 'address', type: 'text' })
  address: string;

  @Column({ name: 'business_address', type: 'text' })
  businessAddress: string;

  @Column({
    name: 'business_phone_number',
    type: 'varchar',
    nullable: true,
    length: 16,
  })
  businessPhoneNumber: string | null;

  @Column({
    name: 'access_expiry_date',
    type: 'date',
    nullable: true,
  })
  accessExpiryDate: Date;

  @ManyToOne(() => Branch, (branch) => branch.users)
  @JoinColumn([{ name: 'branch_id', referencedColumnName: 'id' }])
  branch: Branch;

  @ManyToOne(() => Organization, (organization) => organization.users)
  @JoinColumn([{ name: 'organization_id', referencedColumnName: 'id' }])
  organization: Organization;

  @OneToMany(() => UserGroup, (userGroup) => userGroup.user)
  userGroups: UserGroup[];

  @OneToMany(
    () => UserUserPermission,
    (userUserPermission) => userUserPermission.user,
  )
  userUserPermissions: UserUserPermission[];

  @OneToMany(() => DjangoAdminLog, (djangoAdminLog) => djangoAdminLog.user)
  djangoAdminLogs: DjangoAdminLog[];

  @OneToMany(() => PreventiveMaintenanceAssignees, (pma) => pma.user)
  preventiveMaintenanceAssignees: PreventiveMaintenanceAssignees[];

  @OneToMany(() => MasterPreventiveMaintenanceAssignees, (mpma) => mpma.user)
  masterPreventiveMaintenanceAssignees: MasterPreventiveMaintenanceAssignees[];

  @OneToMany(() => PreventiveMaintenanceDocuments, (pmd) => pmd.uploadedBy)
  preventiveMaintenanceDocuments: PreventiveMaintenanceDocuments[];

  @OneToMany(() => Project, (project) => project.createdBy)
  projects: Project[];

  @OneToMany(() => SubProject, (subProject) => subProject.createdBy)
  subProject: SubProject[];

  @OneToMany(() => Permission, (permission) => permission.user)
  permissions: Permission[];

  @OneToMany(() => Comment, (comment) => comment.sentBy)
  comments: Comment[];

  @OneToMany(() => ProjectAccount, (pa) => pa.user)
  projectsAccounts: ProjectAccount[];

  @OneToMany(() => ProcedureSteps, (mps) => mps.completedBy)
  procedureSteps: ProcedureSteps[];

  @OneToMany(() => UserContact, (userContact) => userContact.contact)
  userContacts: UserContact[];

  @OneToMany(() => UserContact, (userContact) => userContact.user)
  userContacts2: UserContact[];

  @OneToMany(
    () => UserFcmToken,
    (notificationFcmToken) => notificationFcmToken.user,
  )
  notificationFcmToken: UserFcmToken[];

  @OneToMany(
    () => ProceduresLibrary,
    (procedureLibraries) => procedureLibraries.createdBy,
  )
  procedureLibraries: ProceduresLibrary[];

  @OneToMany(() => ProjectTeamMembers, (ptm) => ptm.user)
  projectTeamMembers: ProjectTeamMembers[];

  @Column({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;

  @AfterLoad()
  async populateSignedURLs() {
    if (
      this.image_url &&
      !this.image_url?.startsWith('https://ui-avatars.com')
    ) {
      const signedUrl = await s3.privateSignedUrl(
        AWS_S3_BUCKET_NAME,
        this.image_url,
        604800,
      );
      this.image_url = signedUrl;
    } else {
      this.image_url = this.image_url;
    }
  }

  constructor(entity: Partial<User>) {
    Object.assign(this, entity);
  }
}
