import { Comment } from '../entities/comment.entity';
import { DjangoComment } from '../dto/create-comment-response.dto';
import { User } from 'modules/users/entities/user.entity';

export const mapCommentsToDjangoResponse = (
  comment: Comment,
): DjangoComment => {
  return {
    content_type: comment.contentType,
    created_at: comment.createdAt,
    file_name: comment.fileName,
    text: comment.text,
    is_system_generated: comment.isSystemGenerated,
    is_active: comment.isActive,
    project: comment.subProject.id,
    reference_id: comment.referenceId,
    reference_type: comment.referenceType,
    id: comment.id,
    s3_key: comment.s3Key,
    s3_url: comment.s3Key,
    sent_by: {
      id: comment.sentBy.id,
      first_name: comment.sentBy.first_name,
      last_name: comment.sentBy.last_name,
      email: comment.sentBy.email,
      image_url: comment.sentBy.image_url,
    } as any,
    updated_at: comment.updatedAt,
  };
};
