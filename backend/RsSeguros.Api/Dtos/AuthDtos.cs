namespace RsSeguros.Api.Dtos;

public record LoginRequest(string? Email, string? Senha);

public record LoginResponse(string Token, DateTime ExpiraEm, string Email);
