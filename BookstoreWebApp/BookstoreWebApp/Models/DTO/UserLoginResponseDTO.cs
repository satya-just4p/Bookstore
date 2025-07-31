namespace BookstoreWebApp.Models.DTO
{
	public class UserLoginResponseDTO
	{
		public Guid UserId { get; set; }
		public string EmailAddress { get; set; }
		public string UserName { get; set; }
		public string Token { get; set; }
	}
}
