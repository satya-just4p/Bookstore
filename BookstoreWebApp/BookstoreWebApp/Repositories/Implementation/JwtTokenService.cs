using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BookstoreWebApp.Models.Domain;
using BookstoreWebApp.Repositories.Interface;
using Microsoft.IdentityModel.Tokens;

namespace BookstoreWebApp.Repositories.Implementation
{
	public class JwtTokenService:IJwtTokenService
	{
		private readonly IConfiguration _configuration;
		public JwtTokenService(IConfiguration configuration)
		{
			this._configuration = configuration;
		}

		public string GenerateToken(Users user)
		{
			var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
			var creds = new SigningCredentials(key,SecurityAlgorithms.HmacSha256);

			var claims = new[]
			{
				new Claim(JwtRegisteredClaimNames.Sub,user.EmailAddress),
				new Claim(JwtRegisteredClaimNames.Jti,Guid.NewGuid().ToString()),
				new Claim(ClaimTypes.NameIdentifier,user.UserId.ToString())
			};

			var token = new JwtSecurityToken(
				issuer: _configuration["Jwt:Issuer"],
				audience: _configuration["Jwt:Audience"],
				claims:claims,
				expires: DateTime.UtcNow.AddMinutes(double.Parse(_configuration["Jwt:ExpiresInMinutes"])),
				signingCredentials:creds
				);

			return new JwtSecurityTokenHandler().WriteToken(token);

		}
	}
}
