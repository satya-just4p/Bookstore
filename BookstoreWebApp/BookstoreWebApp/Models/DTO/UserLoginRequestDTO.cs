namespace BookstoreWebApp.Models.DTO
{
	public class UserLoginRequestDTO
	{
		public string EmailAddress { get; set; }
		public string PasswordPlainText { get; set; }
	}
}
