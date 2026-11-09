export type SignInValues = {
  email: string;
  password: string;
};

export type SignUpValues = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type SignInFieldErrors = Partial<Record<keyof SignInValues, string>>;

export type SignUpFieldErrors = Partial<Record<keyof SignUpValues, string>>;
