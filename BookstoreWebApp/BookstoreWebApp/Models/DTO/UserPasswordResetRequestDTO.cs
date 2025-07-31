namespace BookstoreWebApp.Models.DTO
{
	public class UserPasswordResetRequestDTO
	{
		public string EmailAddress { get; set; }
		public string PasswordPlainText { get; set; }
	}
}
