// Define the ErrorDetail type for individual errors
export type ErrorDetail = {
  message: string;
  code: string;
  path: Array<string | number>;
};

// Define the ErrorResponse type for the whole error object
export type ErrorObj = {
  errors: ErrorDetail[];
  status: string;
  statusCode: 200 | 400 | 401 | 403 | 404 | 500;
};

export type APIResponse<T, M = {}> = {
  data?: T;
  meta?: M;
  error?: ErrorObj;
};

// Define the type for the parameters object
export type FetchBookingsParams = {
  includeCustomer: boolean;
  includeVenue: boolean;
  accessToken: string;
};
