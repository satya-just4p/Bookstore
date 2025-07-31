namespace BookstoreWebApp.Models.DTO
{
	public class AddUserResponseDTO
	{
		public Guid UserId { get; set; }
		public string UserName { get; set; }
		public string EmailAddress { get; set; }
		public DateTime CreatedOn { get; set; }

	}
}
