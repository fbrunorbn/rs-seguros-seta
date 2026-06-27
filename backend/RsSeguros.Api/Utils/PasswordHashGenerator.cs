namespace RsSeguros.Api.Utils;

public static class PasswordHashGenerator
{
    public static string Generate(string password)
    {
        return BCrypt.Net.BCrypt.HashPassword(password, workFactor: 12);
    }
}
