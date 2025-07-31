namespace BookstoreWebApp.Models.DTO
{
	public class EditUserResponseDTO
	{
		public Guid UserId { get; set; }

		public string UserName { get; set; }
		public string EmailAddress { get; set; }
		public DateTime UpdatedOn { get; set; }
	}
}
