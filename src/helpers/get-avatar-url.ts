import { API_BASE_URL } from "../constants";

export const getAvatarUrl = (avatarPath?: string) => {
  return `${API_BASE_URL}/resources${avatarPath}`;
};
