import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface MatrixDimensions {
  rows_a: number;
  cols_a: number;
  rows_b: number;
  cols_b: number;
}

export interface MatrixMultiplicationRequest {
  matrix_a: number[][];
  matrix_b: number[][];
  use_modular?: boolean;
}

export interface MatrixMultiplicationResponse {
  result: number[][];
  algorithm_used: string;
  operations_count: number;
}

export const multiplyMatrices = async (
  data: MatrixMultiplicationRequest
): Promise<MatrixMultiplicationResponse> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/multiply`, data);
    return response.data;
  } catch (error) {
    console.error('Error multiplying matrices:', error);
    throw error;
  }
};

export const getSupportedDimensions = async (): Promise<MatrixDimensions[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/supported-dimensions`);
    return response.data;
  } catch (error) {
    console.error('Error getting supported dimensions:', error);
    throw error;
  }
};
