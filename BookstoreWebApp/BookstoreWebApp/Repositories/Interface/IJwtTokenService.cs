using BookstoreWebApp.Models.Domain;

namespace BookstoreWebApp.Repositories.Interface
{
	public interface IJwtTokenService
	{
		public string GenerateToken(Users user);
	}
}
