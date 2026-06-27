using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.RegularExpressions;
using Microsoft.IdentityModel.Tokens;
using RsSeguros.Api.Dtos;
using RsSeguros.Api.Settings;

namespace RsSeguros.Api.Services;

public class AuthService(JwtSettings jwtSettings, AdminSettings adminSettings) : IAuthService
{
    private static bool IsProbablyBcrypt(string? hash) =>
        !string.IsNullOrWhiteSpace(hash) && Regex.IsMatch(hash!, @"^\$2[aby]\$\d{2}\$");

    private static string FixBcryptHashIfCorrupted(string? hash)
    {
        if (string.IsNullOrWhiteSpace(hash)) return hash ?? string.Empty;
        // Detect pattern with '/' instead of '$' after rounds: e.g. "$2a$12/..."
        var m = Regex.Match(hash, @"^\$2[aby]\$\d{2}/");
        if (m.Success)
        {
            int idx = m.Value.LastIndexOf('/');
            if (idx >= 0 && idx < hash.Length - 1)
            {
                return hash.Substring(0, idx) + "$" + hash.Substring(idx + 1);
            }
        }
        return hash;
    }

    public LoginResponse Login(LoginRequest request)
    {
        var email = request.Email?.Trim() ?? string.Empty;
        var password = request.Senha ?? string.Empty;

        var emailMatches = string.Equals(email, adminSettings.Email, StringComparison.OrdinalIgnoreCase);

        var storedHash = FixBcryptHashIfCorrupted(adminSettings.PasswordHash);
        if (!IsProbablyBcrypt(storedHash))
            throw new InvalidOperationException("PasswordHash inválido na configuração.");

        var passwordMatches = BCrypt.Net.BCrypt.Verify(password, storedHash);

        if (!emailMatches || !passwordMatches)
            throw new UnauthorizedAccessException("Credenciais inválidas.");

        var expires = DateTime.UtcNow.AddHours(8);
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.Secret));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, email),
            new Claim(JwtRegisteredClaimNames.Email, email),
            new Claim(ClaimTypes.Role, "admin")
        };

        var token = new JwtSecurityToken(
            issuer: jwtSettings.Issuer,
            audience: jwtSettings.Audience,
            claims: claims,
            expires: expires,
            signingCredentials: credentials);

        return new LoginResponse(new JwtSecurityTokenHandler().WriteToken(token), expires, email);
    }
}
