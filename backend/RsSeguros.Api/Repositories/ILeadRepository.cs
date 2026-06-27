using RsSeguros.Api.Dtos;
using RsSeguros.Api.Models;

namespace RsSeguros.Api.Repositories;

public interface ILeadRepository
{
    Task<Lead> CreateAsync(Lead lead);
    Task<IReadOnlyCollection<Lead>> GetAsync(LeadFilterRequest filter, int page, int pageSize);
    Task<IReadOnlyCollection<Lead>> GetAllAsync(LeadFilterRequest filter);
    Task<long> CountAsync(LeadFilterRequest filter);
    Task<Lead?> GetByIdAsync(string id);
    Task<Lead?> UpdateAsync(string id, Lead lead);
    Task<Lead?> UpdateStatusAsync(string id, string status);
    Task<bool> DeleteAsync(string id);
}
