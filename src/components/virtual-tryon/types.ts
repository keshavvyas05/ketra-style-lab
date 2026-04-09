export type TryOnRequest = {
  user_image: string;
  outfit_image: string;
};

export type TryOnSuccessResponse = {
  success: true;
  data: any;
};

export type TryOnErrorResponse = {
  success: false;
  error: string;
};

export type TryOnResponse = TryOnSuccessResponse | TryOnErrorResponse;
