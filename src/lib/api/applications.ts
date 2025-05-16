
import { apiClient } from './client';
import { Application, ApiResponse } from './types';

export async function fetchApplications(): Promise<Application[]> {
  const response = await apiClient.get<ApiResponse<Application[]>>('applications');
  return response.data;
}

export async function fetchApplication(id: string): Promise<Application> {
  const response = await apiClient.get<ApiResponse<Application>>(`applications/${id}`);
  return response.data;
}

export async function createApplication(data: Partial<Application>): Promise<Application> {
  const response = await apiClient.post<ApiResponse<Application>>('register', data);
  return response.data;
}

export async function updateApplication(id: string, data: Partial<Application>): Promise<Application> {
  const response = await apiClient.put<ApiResponse<Application>>(`applications/${id}`, data);
  return response.data;
}

export async function toggleApplicationStatus(id: string, isActive: boolean): Promise<Application> {
  const response = await apiClient.put<ApiResponse<Application>>(`applications/${id}/toggle-status`, { is_active: isActive });
  return response.data;
}
