import { UserResponse } from 'common/dto/users/userResponse.dto';
import request, { AxiosPromise } from './request';

/**
 * Get the currently authenticated user
 */

const getCurrentUser = (): AxiosPromise<UserResponse> => request.get('/api/users/current');

/**
 * Export the methods as part of an object so that they are stubbable.
 * See: https://github.com/sinonjs/sinon/issues/562
 */
export const UserAPI = {
  getCurrentUser,
};
