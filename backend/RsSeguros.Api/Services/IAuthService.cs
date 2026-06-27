using RsSeguros.Api.Dtos;

namespace RsSeguros.Api.Services;

public interface IAuthService
{
    LoginResponse Login(LoginRequest request);
}
