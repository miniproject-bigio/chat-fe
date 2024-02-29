export type AuthError = {
  message: string;
};

export type AuthResponse = {
  message: string;
  data: {
    user: {
      id: string;
      username: string;
    };
    accessToken: string;
  };
};