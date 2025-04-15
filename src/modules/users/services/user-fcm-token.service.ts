import { In } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { UserFcmTokenRepository } from '../repositories/user-fcm-token.repository';

@Injectable()
export class UserFcmTokenService {
  constructor(private fcmTokenRepository: UserFcmTokenRepository) {}

  /**
   * Retrieves FCM tokens associated with the provided user IDs.
   * @param userIds An array of user IDs for which FCM tokens are to be retrieved.
   * @returns A promise that resolves to an array of FCM tokens corresponding to the provided user IDs.
   */
  async findFcmTokensByUserIds(userIds: string[]): Promise<string[]> {
    const userTokens = await this.fcmTokenRepository.find({
      where: { userId: In(userIds) },
    });
    return userTokens.map((user) => user.token);
  }

  /**
   * Deletes FCM tokens associated with the provided tokens.
   * @param tokens An array of tokens for which FCM tokens are to be deleted.
   * @returns void
   */
  async deleteFcmTokens(tokens: string[]) {
    await this.fcmTokenRepository.delete({ token: In(tokens) });
  }
}
