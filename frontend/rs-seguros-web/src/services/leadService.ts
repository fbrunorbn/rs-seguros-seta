import { api } from './api';

export type LeadStatus = 'novo' | 'exportado' | 'contatado' | 'convertido' | 'descartado';

export interface Lead {
  id: string;
  nome: string;
  whatsapp: string;
  cidade: string;
  bairro: string;
  tipoVeiculo: string;
  modeloVeiculo: string;
  anoVeiculo: string;
  placaVeiculo: string;
  interesse: string;
  mensagem: string;
  origem: string;
  status: LeadStatus;
  consentimentoLgpd: boolean;
  criadoEm: string;
  atualizadoEm: string;
}

export interface LeadFilters {
  dataInicio?: string;
  dataFim?: string;
  cidade?: string;
  status?: string;
  tipoVeiculo?: string;
  origem?: string;
}

export interface LeadListResponse {
  items: Lead[];
  total: number;
  page: number;
  pageSize: number;
}

export interface CreateLeadPayload {
  nome: string;
  whatsapp: string;
  cidade: string;
  bairro?: string;
  tipoVeiculo: string;
  modeloVeiculo?: string;
  anoVeiculo?: string;
  placaVeiculo?: string;
  interesse?: string;
  mensagem?: string;
  origem?: string;
  consentimentoLgpd: boolean;
}

export interface UpdateLeadPayload {
  nome: string;
  whatsapp: string;
  cidade: string;
  bairro: string;
  tipoVeiculo: string;
  placaVeiculo: string;
  modeloVeiculo: string;
  anoVeiculo: string;
  interesse: string;
  mensagem: string;
  origem: string;
  status: LeadStatus;
  consentimentoLgpd: boolean;
}

export async function createLead(payload: CreateLeadPayload) {
  const { data } = await api.post<Lead>('/leads', payload);
  return data;
}

export async function getLeads(filters: LeadFilters, page = 1, pageSize = 20) {
  const { data } = await api.get<LeadListResponse>('/admin/leads', {
    params: { ...filters, page, pageSize },
  });
  return data;
}

export async function updateLeadStatus(id: string, status: LeadStatus) {
  const { data } = await api.patch<Lead>(`/admin/leads/${id}/status`, { status });
  return data;
}

export async function updateLead(id: string, payload: UpdateLeadPayload) {
  const { data } = await api.put<Lead>(`/admin/leads/${id}`, payload);
  return data;
}

export async function deleteLead(id: string) {
  await api.delete(`/admin/leads/${id}`);
}

export async function exportLeads(format: 'csv' | 'xlsx', filters: LeadFilters) {
  const { data } = await api.get<Blob>(`/admin/leads/export/${format}`, {
    params: filters,
    responseType: 'blob',
  });

  const url = window.URL.createObjectURL(data);
  const link = document.createElement('a');
  link.href = url;
  link.download = `leads-seta-rafael.${format}`;
  link.click();
  window.URL.revokeObjectURL(url);
}
