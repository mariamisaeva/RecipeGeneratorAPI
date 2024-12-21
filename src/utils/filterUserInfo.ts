import { User } from '../entities/User';

export const filterUserInfo = (user: Partial<User>) => {
  const { password, email, ...filteredUser } = user;
  return filteredUser;
};
