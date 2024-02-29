export interface UsersListProps {
  filteredUsers: any[];
  handleUsernameClick: (username: string) => void;
  selectedUsername: string | null;
  uuid: string | null;
}