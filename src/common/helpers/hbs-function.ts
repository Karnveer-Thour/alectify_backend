export const fieldRender = (data) => {
  return data ? data : '-';
};

export const teamMemberAvatar = (user) => {
  return `https://ui-avatars.com/api/?name=${user.user.first_name[0]} ${user.user.last_name[0]}`;
};
