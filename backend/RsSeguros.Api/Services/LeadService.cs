using RsSeguros.Api.Dtos;
using RsSeguros.Api.Models;
using RsSeguros.Api.Repositories;

namespace RsSeguros.Api.Services;

public class LeadService(ILeadRepository repository) : ILeadService
{
    public async Task<LeadResponse> CreateAsync(CreateLeadRequest request)
    {
        ValidateCreate(request);

        var now = DateTime.UtcNow;
        var lead = new Lead
        {
            Nome = Clean(request.Nome),
            Whatsapp = Clean(request.Whatsapp),
            Cidade = Clean(request.Cidade),
            Bairro = Clean(request.Bairro),
            TipoVeiculo = Clean(request.TipoVeiculo),
            ModeloVeiculo = Clean(request.ModeloVeiculo),
            AnoVeiculo = Clean(request.AnoVeiculo),
            PlacaVeiculo = Clean(request.PlacaVeiculo).ToUpperInvariant(),
            Interesse = Clean(request.Interesse),
            Mensagem = Clean(request.Mensagem),
            Origem = string.IsNullOrWhiteSpace(request.Origem) ? "site" : request.Origem.Trim().ToLowerInvariant(),
            Status = LeadStatus.Novo,
            ConsentimentoLgpd = true,
            CriadoEm = now,
            AtualizadoEm = now
        };

        return ToResponse(await repository.CreateAsync(lead));
    }

    public async Task<PagedResult<LeadResponse>> GetAsync(LeadFilterRequest filter, int page, int pageSize)
    {
        page = Math.Max(page, 1);
        pageSize = Math.Clamp(pageSize, 1, 100);

        var items = await repository.GetAsync(NormalizeFilter(filter), page, pageSize);
        var total = await repository.CountAsync(NormalizeFilter(filter));

        return new PagedResult<LeadResponse>(items.Select(ToResponse).ToList(), total, page, pageSize);
    }

    public async Task<LeadResponse> GetByIdAsync(string id)
    {
        var lead = await repository.GetByIdAsync(id) ?? throw new KeyNotFoundException("Lead não encontrado.");
        return ToResponse(lead);
    }

    public async Task<LeadResponse> UpdateAsync(string id, UpdateLeadRequest request)
    {
        ValidateUpdate(request);

        var existing = await repository.GetByIdAsync(id) ?? throw new KeyNotFoundException("Lead nÃ£o encontrado.");
        var normalizedStatus = request.Status?.Trim().ToLowerInvariant() ?? string.Empty;

        var lead = new Lead
        {
            Id = existing.Id,
            Nome = Clean(request.Nome),
            Whatsapp = Clean(request.Whatsapp),
            Cidade = Clean(request.Cidade),
            Bairro = Clean(request.Bairro),
            TipoVeiculo = Clean(request.TipoVeiculo),
            PlacaVeiculo = Clean(request.PlacaVeiculo).ToUpperInvariant(),
            ModeloVeiculo = Clean(request.ModeloVeiculo),
            AnoVeiculo = Clean(request.AnoVeiculo),
            Interesse = Clean(request.Interesse),
            Mensagem = Clean(request.Mensagem),
            Origem = string.IsNullOrWhiteSpace(request.Origem) ? "site" : request.Origem.Trim().ToLowerInvariant(),
            Status = normalizedStatus,
            ConsentimentoLgpd = request.ConsentimentoLgpd,
            CriadoEm = existing.CriadoEm,
            AtualizadoEm = DateTime.UtcNow
        };

        var updated = await repository.UpdateAsync(id, lead) ?? throw new KeyNotFoundException("Lead nÃ£o encontrado.");
        return ToResponse(updated);
    }

    public async Task<LeadResponse> UpdateStatusAsync(string id, string status)
    {
        var normalizedStatus = status?.Trim().ToLowerInvariant();

        if (!LeadStatus.EhValido(normalizedStatus))
            throw new ArgumentException("Status inválido.");

        var lead = await repository.UpdateStatusAsync(id, normalizedStatus!) ?? throw new KeyNotFoundException("Lead não encontrado.");
        return ToResponse(lead);
    }

    public async Task DeleteAsync(string id)
    {
        if (!await repository.DeleteAsync(id))
            throw new KeyNotFoundException("Lead nÃ£o encontrado.");
    }

    public async Task<IReadOnlyCollection<LeadResponse>> GetForExportAsync(LeadFilterRequest filter)
    {
        var leads = await repository.GetAllAsync(NormalizeFilter(filter));
        return leads.Select(ToResponse).ToList();
    }

    private static void ValidateCreate(CreateLeadRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Nome))
            throw new ArgumentException("Informe o nome completo.");

        if (string.IsNullOrWhiteSpace(request.Whatsapp))
            throw new ArgumentException("Informe o WhatsApp.");

        if (string.IsNullOrWhiteSpace(request.Cidade))
            throw new ArgumentException("Informe a cidade.");

        if (string.IsNullOrWhiteSpace(request.TipoVeiculo))
            throw new ArgumentException("Informe o tipo de veículo.");

        if (!request.ConsentimentoLgpd)
            throw new ArgumentException("É necessário autorizar o contato para solicitar a cotação.");
    }

    private static void ValidateUpdate(UpdateLeadRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Nome))
            throw new ArgumentException("Informe o nome completo.");

        if (string.IsNullOrWhiteSpace(request.Whatsapp))
            throw new ArgumentException("Informe o WhatsApp.");

        if (string.IsNullOrWhiteSpace(request.Cidade))
            throw new ArgumentException("Informe a cidade.");

        if (string.IsNullOrWhiteSpace(request.TipoVeiculo))
            throw new ArgumentException("Informe o tipo de veÃ­culo.");

        if (!LeadStatus.EhValido(request.Status))
            throw new ArgumentException("Status invÃ¡lido.");
    }

    private static LeadFilterRequest NormalizeFilter(LeadFilterRequest filter)
    {
        return filter with
        {
            Status = string.IsNullOrWhiteSpace(filter.Status) ? null : filter.Status.Trim().ToLowerInvariant(),
            Origem = string.IsNullOrWhiteSpace(filter.Origem) ? null : filter.Origem.Trim().ToLowerInvariant()
        };
    }

    private static string Clean(string? value) => value?.Trim() ?? string.Empty;

    private static LeadResponse ToResponse(Lead lead)
    {
        return new LeadResponse(
            lead.Id ?? string.Empty,
            lead.Nome,
            lead.Whatsapp,
            lead.Cidade,
            lead.Bairro,
            lead.TipoVeiculo,
            lead.ModeloVeiculo,
            lead.AnoVeiculo,
            lead.PlacaVeiculo,
            lead.Interesse,
            lead.Mensagem,
            lead.Origem,
            lead.Status,
            lead.ConsentimentoLgpd,
            lead.CriadoEm,
            lead.AtualizadoEm);
    }
}
