import axios, { AxiosError } from "axios"
import type { Todo } from "../../types/todo.ts"

const API_URL = "http://127.0.0.1:8000/api/todos/"

// Error response interface
interface ErrorResponse {
  error?: string;
  [key: string]: any;
}

// Custom error class for API errors
export class ApiError extends Error {
  statusCode?: number;
  details?: any;

  constructor(
    message: string,
    statusCode?: number,
    details?: any
  ) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.details = details;
  }
}

// Helper function to extract error message from response
function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ErrorResponse>;

    // Check if we have a response from the server
    if (axiosError.response) {
      const data = axiosError.response.data;

      // If there's a specific error message
      if (data?.error) {
        return data.error;
      }

      // If there are validation errors, combine them
      if (typeof data === 'object' && data !== null) {
        const errors = Object.entries(data)
          .filter(([key]) => key !== 'error')
          .map(([key, value]) => {
            if (Array.isArray(value)) {
              return `${key}: ${value.join(', ')}`;
            }
            return `${key}: ${value}`;
          });

        if (errors.length > 0) {
          return errors.join('; ');
        }
      }

      // Default error messages based on status code
      switch (axiosError.response.status) {
        case 400:
          return 'Invalid data provided. Please check your input.';
        case 404:
          return 'The requested todo was not found.';
        case 500:
          return 'Server error. Please try again later.';
        default:
          return `Request failed with status ${axiosError.response.status}`;
      }
    }

    // Network errors
    if (axiosError.request) {
      return 'Unable to connect to the server. Please check your connection.';
    }
  }

  // Fallback error message
  return error instanceof Error ? error.message : 'An unexpected error occurred';
}

export async function fetchTodos(): Promise<Todo[]> {
  try {
    const res = await axios.get(API_URL);
    return res.data;
  } catch (error) {
    const message = getErrorMessage(error);
    const statusCode = axios.isAxiosError(error) ? error.response?.status : undefined;
    throw new ApiError(message, statusCode);
  }
}

export async function createTodo(data: Partial<Todo>): Promise<Todo> {
  try {
    const res = await axios.post(API_URL, data);
    return res.data;
  } catch (error) {
    const message = getErrorMessage(error);
    const statusCode = axios.isAxiosError(error) ? error.response?.status : undefined;
    throw new ApiError(message, statusCode);
  }
}

export async function updateTodo(id: number, data: Partial<Todo>): Promise<Todo> {
  try {
    const res = await axios.put(`${API_URL}${id}/`, data);
    return res.data;
  } catch (error) {
    const message = getErrorMessage(error);
    const statusCode = axios.isAxiosError(error) ? error.response?.status : undefined;
    throw new ApiError(message, statusCode);
  }
}

export async function deleteTodo(id: number): Promise<void> {
  try {
    await axios.delete(`${API_URL}${id}/`);
  } catch (error) {
    const message = getErrorMessage(error);
    const statusCode = axios.isAxiosError(error) ? error.response?.status : undefined;
    throw new ApiError(message, statusCode);
  }
}

