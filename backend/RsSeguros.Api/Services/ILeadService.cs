using RsSeguros.Api.Dtos;

namespace RsSeguros.Api.Services;

public interface ILeadService
{
    Task<LeadResponse> CreateAsync(CreateLeadRequest request);
    Task<PagedResult<LeadResponse>> GetAsync(LeadFilterRequest filter, int page, int pageSize);
    Task<LeadResponse> GetByIdAsync(string id);
    Task<LeadResponse> UpdateAsync(string id, UpdateLeadRequest request);
    Task<LeadResponse> UpdateStatusAsync(string id, string status);
    Task DeleteAsync(string id);
    Task<IReadOnlyCollection<LeadResponse>> GetForExportAsync(LeadFilterRequest filter);
}
