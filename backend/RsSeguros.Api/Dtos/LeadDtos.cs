namespace RsSeguros.Api.Dtos;

public record CreateLeadRequest(
    string? Nome,
    string? Whatsapp,
    string? Cidade,
    string? Bairro,
    string? TipoVeiculo,
    string? ModeloVeiculo,
    string? AnoVeiculo,
    string? PlacaVeiculo,
    string? Interesse,
    string? Mensagem,
    string? Origem,
    bool ConsentimentoLgpd);

public record LeadResponse(
    string Id,
    string Nome,
    string Whatsapp,
    string Cidade,
    string Bairro,
    string TipoVeiculo,
    string ModeloVeiculo,
    string AnoVeiculo,
    string PlacaVeiculo,
    string Interesse,
    string Mensagem,
    string Origem,
    string Status,
    bool ConsentimentoLgpd,
    DateTime CriadoEm,
    DateTime AtualizadoEm);

public record UpdateLeadStatusRequest(string? Status);

public record UpdateLeadRequest(
    string? Nome,
    string? Whatsapp,
    string? Cidade,
    string? Bairro,
    string? TipoVeiculo,
    string? PlacaVeiculo,
    string? ModeloVeiculo,
    string? AnoVeiculo,
    string? Interesse,
    string? Mensagem,
    string? Origem,
    string? Status,
    bool ConsentimentoLgpd);

public record LeadFilterRequest(
    DateTime? DataInicio,
    DateTime? DataFim,
    string? Cidade,
    string? Status,
    string? TipoVeiculo,
    string? Origem);

public record PagedResult<T>(IReadOnlyCollection<T> Items, long Total, int Page, int PageSize);
