import { Download, Eye, MessageCircle, Pencil, Search, Trash2, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import {
  deleteLead,
  exportLeads,
  getLeads,
  type Lead,
  type LeadFilters,
  type LeadStatus,
  type UpdateLeadPayload,
  updateLead,
  updateLeadStatus,
} from '../services/leadService';

const statuses: LeadStatus[] = ['novo', 'exportado', 'contatado', 'convertido', 'descartado'];
const vehicleTypes = ['Carro', 'Moto', 'Caminhonete', 'Táxi/App', 'Outro'];

type Feedback = { type: 'success' | 'error'; message: string } | null;

function toEditPayload(lead: Lead): UpdateLeadPayload {
  return {
    nome: lead.nome || '',
    whatsapp: lead.whatsapp || '',
    cidade: lead.cidade || '',
    bairro: lead.bairro || '',
    tipoVeiculo: lead.tipoVeiculo || '',
    placaVeiculo: lead.placaVeiculo || '',
    modeloVeiculo: lead.modeloVeiculo || '',
    anoVeiculo: lead.anoVeiculo || '',
    interesse: lead.interesse || '',
    mensagem: lead.mensagem || '',
    origem: lead.origem || 'site',
    status: lead.status,
    consentimentoLgpd: lead.consentimentoLgpd,
  };
}

export function AdminLeadsPage() {
  const [filters, setFilters] = useState<LeadFilters>({});
  const [draft, setDraft] = useState<LeadFilters>({});
  const [leads, setLeads] = useState<Lead[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editDraft, setEditDraft] = useState<UpdateLeadPayload | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Feedback>(null);

  const summary = useMemo(() => ({
    novos: leads.filter((lead) => lead.status === 'novo').length,
    contatados: leads.filter((lead) => lead.status === 'contatado').length,
    convertidos: leads.filter((lead) => lead.status === 'convertido').length,
    descartados: leads.filter((lead) => lead.status === 'descartado').length,
  }), [leads]);

  async function loadLeads(nextPage = page, nextFilters = filters) {
    setLoading(true);
    try {
      const data = await getLeads(nextFilters, nextPage, 20);
      setLeads(data.items);
      setTotal(data.total);
      setPage(data.page);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let active = true;

    getLeads({}, 1, 20)
      .then((data) => {
        if (!active) return;
        setLeads(data.items);
        setTotal(data.total);
        setPage(data.page);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  function updateDraft(key: keyof LeadFilters, value: string) {
    setDraft((current) => ({ ...current, [key]: value || undefined }));
  }

  function updateEditDraft<K extends keyof UpdateLeadPayload>(key: K, value: UpdateLeadPayload[K]) {
    setEditDraft((current) => current ? { ...current, [key]: value } : current);
  }

  function search() {
    setFilters(draft);
    loadLeads(1, draft);
  }

  function clear() {
    setDraft({});
    setFilters({});
    loadLeads(1, {});
  }

  function openDetails(lead: Lead) {
    setSelectedLead(lead);
    setIsEditing(false);
    setEditDraft(toEditPayload(lead));
    setFeedback(null);
  }

  function closeDetails() {
    setSelectedLead(null);
    setIsEditing(false);
    setEditDraft(null);
    setFeedback(null);
    setSaving(false);
  }

  function startEditing() {
    if (!selectedLead) return;
    setEditDraft(toEditPayload(selectedLead));
    setIsEditing(true);
    setFeedback(null);
  }

  function cancelEditing() {
    if (selectedLead) setEditDraft(toEditPayload(selectedLead));
    setIsEditing(false);
    setFeedback(null);
  }

  async function changeStatus(lead: Lead, status: LeadStatus) {
    const updated = await updateLeadStatus(lead.id, status);
    setLeads((current) => current.map((item) => (item.id === lead.id ? updated : item)));
    if (selectedLead?.id === lead.id) {
      setSelectedLead(updated);
      setEditDraft(toEditPayload(updated));
    }
  }

  async function saveLead() {
    if (!selectedLead || !editDraft) return;

    if (!editDraft.nome.trim() || !editDraft.whatsapp.trim() || !editDraft.cidade.trim() || !editDraft.tipoVeiculo.trim() || !editDraft.status) {
      setFeedback({ type: 'error', message: 'Preencha nome, WhatsApp, cidade, tipo de veículo e status.' });
      return;
    }

    setSaving(true);
    setFeedback(null);
    try {
      const updated = await updateLead(selectedLead.id, editDraft);
      setLeads((current) => current.map((item) => (item.id === updated.id ? updated : item)));
      setSelectedLead(updated);
      setEditDraft(toEditPayload(updated));
      setIsEditing(false);
      setFeedback({ type: 'success', message: 'Lead atualizado com sucesso.' });
    } catch {
      setFeedback({ type: 'error', message: 'Não foi possível atualizar o lead.' });
    } finally {
      setSaving(false);
    }
  }

  async function removeLead(lead: Lead) {
    const confirmed = window.confirm('Tem certeza que deseja excluir este lead? Essa ação não pode ser desfeita.');
    if (!confirmed) return;

    setDeletingId(lead.id);
    setFeedback(null);
    try {
      await deleteLead(lead.id);
      setLeads((current) => current.filter((item) => item.id !== lead.id));
      setTotal((current) => Math.max(0, current - 1));
      if (selectedLead?.id === lead.id) closeDetails();
      setFeedback({ type: 'success', message: 'Lead excluído com sucesso.' });
    } catch {
      setFeedback({ type: 'error', message: 'Não foi possível excluir o lead.' });
    } finally {
      setDeletingId(null);
    }
  }

  function openWhatsapp(lead: Lead) {
    const number = lead.whatsapp.replace(/\D/g, '');
    const message = encodeURIComponent(`Olá, ${lead.nome}! Vi que você solicitou uma cotação da SETA Proteção Veicular. Posso te passar as opções disponíveis?`);
    window.open(`https://wa.me/55${number}?text=${message}`, '_blank', 'noopener,noreferrer');
  }

  return (
    <section className="admin-page">
      <div className="admin-title">
        <div>
          <p className="eyebrow">Leads</p>
          <h1>Painel de cotações</h1>
        </div>
        <div className="export-actions">
          <button className="secondary-button" onClick={() => exportLeads('csv', filters)}><Download size={16} /> Exportar CSV</button>
          <button className="secondary-button" onClick={() => exportLeads('xlsx', filters)}><Download size={16} /> Exportar Excel</button>
        </div>
      </div>

      {feedback && <p className={`${feedback.type}-message admin-feedback`}>{feedback.message}</p>}

      <div className="metric-grid">
        <Metric label="Total filtrado" value={total} />
        <Metric label="Novos" value={summary.novos} />
        <Metric label="Contatados" value={summary.contatados} />
        <Metric label="Convertidos" value={summary.convertidos} />
        <Metric label="Descartados" value={summary.descartados} />
      </div>

      <div className="filter-panel">
        <input type="date" value={draft.dataInicio || ''} onChange={(event) => updateDraft('dataInicio', event.target.value)} aria-label="Data inicial" />
        <input type="date" value={draft.dataFim || ''} onChange={(event) => updateDraft('dataFim', event.target.value)} aria-label="Data final" />
        <input placeholder="Cidade" value={draft.cidade || ''} onChange={(event) => updateDraft('cidade', event.target.value)} />
        <select value={draft.status || ''} onChange={(event) => updateDraft('status', event.target.value)}>
          <option value="">Status</option>
          {statuses.map((status) => <option key={status}>{status}</option>)}
        </select>
        <select value={draft.tipoVeiculo || ''} onChange={(event) => updateDraft('tipoVeiculo', event.target.value)}>
          <option value="">Tipo de veículo</option>
          {vehicleTypes.map((type) => <option key={type}>{type}</option>)}
        </select>
        <input placeholder="Origem" value={draft.origem || ''} onChange={(event) => updateDraft('origem', event.target.value)} />
        <button className="primary-button" onClick={search}><Search size={16} /> Buscar</button>
        <button className="secondary-button" onClick={clear}><X size={16} /> Limpar</button>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Placa</th>
              <th>Nome</th>
              <th>WhatsApp</th>
              <th>Cidade</th>
              <th>Tipo de veículo</th>
              <th>Status</th>
              <th>Data</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id}>
                <td>{lead.placaVeiculo || '-'}</td>
                <td>{lead.nome}</td>
                <td>{lead.whatsapp}</td>
                <td>{lead.cidade}</td>
                <td>{lead.tipoVeiculo}</td>
                <td><StatusBadge status={lead.status} /></td>
                <td>{new Date(lead.criadoEm).toLocaleDateString('pt-BR')}</td>
                <td className="row-actions">
                  <button className="icon-button" onClick={() => openDetails(lead)} title="Ver e editar detalhes"><Eye size={18} /></button>
                  <select value={lead.status} onChange={(event) => changeStatus(lead, event.target.value as LeadStatus)}>
                    {statuses.map((status) => <option key={status}>{status}</option>)}
                  </select>
                  <button className="icon-button whatsapp" onClick={() => openWhatsapp(lead)} title="Abrir WhatsApp"><MessageCircle size={18} /></button>
                  <button
                    className="icon-button danger"
                    disabled={deletingId === lead.id}
                    onClick={() => removeLead(lead)}
                    title="Excluir lead"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {!loading && leads.length === 0 && (
              <tr><td colSpan={8} className="empty-state">Nenhum lead encontrado.</td></tr>
            )}
            {loading && (
              <tr><td colSpan={8} className="empty-state">Carregando leads...</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button className="secondary-button" disabled={page <= 1} onClick={() => loadLeads(page - 1)}>Anterior</button>
        <span>Página {page}</span>
        <button className="secondary-button" disabled={page * 20 >= total} onClick={() => loadLeads(page + 1)}>Próxima</button>
      </div>

      {selectedLead && editDraft && (
        <div className="modal-backdrop" onClick={closeDetails}>
          <article className="lead-modal" onClick={(event) => event.stopPropagation()}>
            <header className="modal-header">
              <div>
                <p className="eyebrow">Detalhes do lead</p>
                <h2>{selectedLead.nome}</h2>
              </div>
              <div className="modal-actions">
                {!isEditing && <button className="secondary-button" onClick={startEditing}><Pencil size={16} /> Editar</button>}
                <button className="icon-button" onClick={closeDetails} title="Fechar"><X size={18} /></button>
              </div>
            </header>

            {feedback && <p className={`${feedback.type}-message admin-feedback`}>{feedback.message}</p>}

            {isEditing ? (
              <>
                <div className="edit-grid">
                  <label>Nome<input value={editDraft.nome} onChange={(event) => updateEditDraft('nome', event.target.value)} /></label>
                  <label>WhatsApp<input value={editDraft.whatsapp} onChange={(event) => updateEditDraft('whatsapp', event.target.value)} /></label>
                  <label>Cidade<input value={editDraft.cidade} onChange={(event) => updateEditDraft('cidade', event.target.value)} /></label>
                  <label>Bairro<input value={editDraft.bairro} onChange={(event) => updateEditDraft('bairro', event.target.value)} /></label>
                  <label>
                    Tipo de veículo
                    <select value={editDraft.tipoVeiculo} onChange={(event) => updateEditDraft('tipoVeiculo', event.target.value)}>
                      <option value="">Selecione</option>
                      {vehicleTypes.map((type) => <option key={type}>{type}</option>)}
                    </select>
                  </label>
                  <label>Placa<input value={editDraft.placaVeiculo} onChange={(event) => updateEditDraft('placaVeiculo', event.target.value)} /></label>
                  <label>Modelo<input value={editDraft.modeloVeiculo} onChange={(event) => updateEditDraft('modeloVeiculo', event.target.value)} /></label>
                  <label>Ano<input value={editDraft.anoVeiculo} onChange={(event) => updateEditDraft('anoVeiculo', event.target.value)} /></label>
                  <label>Interesse<input value={editDraft.interesse} onChange={(event) => updateEditDraft('interesse', event.target.value)} /></label>
                  <label>Origem<input value={editDraft.origem} onChange={(event) => updateEditDraft('origem', event.target.value)} /></label>
                  <label>
                    Status
                    <select value={editDraft.status} onChange={(event) => updateEditDraft('status', event.target.value as LeadStatus)}>
                      {statuses.map((status) => <option key={status}>{status}</option>)}
                    </select>
                  </label>
                  <label>
                    Consentimento LGPD
                    <select
                      value={editDraft.consentimentoLgpd ? 'sim' : 'nao'}
                      onChange={(event) => updateEditDraft('consentimentoLgpd', event.target.value === 'sim')}
                    >
                      <option value="sim">Sim</option>
                      <option value="nao">Não</option>
                    </select>
                  </label>
                  <label className="wide-field">Mensagem<textarea value={editDraft.mensagem} onChange={(event) => updateEditDraft('mensagem', event.target.value)} /></label>
                </div>
                <footer className="modal-footer">
                  <button className="secondary-button" disabled={saving} onClick={cancelEditing}>Cancelar</button>
                  <button className="primary-button" disabled={saving} onClick={saveLead}>{saving ? 'Salvando...' : 'Salvar alterações'}</button>
                </footer>
              </>
            ) : (
              <>
                <div className="detail-grid">
                  <Detail label="WhatsApp" value={selectedLead.whatsapp} />
                  <Detail label="Placa" value={selectedLead.placaVeiculo} />
                  <Detail label="Cidade" value={selectedLead.cidade} />
                  <Detail label="Bairro" value={selectedLead.bairro} />
                  <Detail label="Tipo de veículo" value={selectedLead.tipoVeiculo} />
                  <Detail label="Modelo" value={selectedLead.modeloVeiculo} />
                  <Detail label="Ano" value={selectedLead.anoVeiculo} />
                  <Detail label="Interesse" value={selectedLead.interesse} />
                  <Detail label="Origem" value={selectedLead.origem} />
                  <Detail label="Status" value={selectedLead.status} />
                  <Detail label="Consentimento LGPD" value={selectedLead.consentimentoLgpd ? 'Sim' : 'Não'} />
                  <Detail label="Criado em" value={new Date(selectedLead.criadoEm).toLocaleString('pt-BR')} />
                </div>
                <p className="modal-message">{selectedLead.mensagem || 'Sem mensagem adicional.'}</p>
                <button className="primary-button full" onClick={() => openWhatsapp(selectedLead)}>
                  <MessageCircle size={18} /> Abrir WhatsApp manualmente
                </button>
              </>
            )}
          </article>
        </div>
      )}
    </section>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <article className="metric-card">
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}

function StatusBadge({ status }: { status: LeadStatus }) {
  return <span className={`status-badge status-${status}`}>{status}</span>;
}

function Detail({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <span>{label}</span>
      <strong>{value || '-'}</strong>
    </div>
  );
}
