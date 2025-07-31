namespace BookstoreWebApp.Models.DTO
{
	public class GetUserDetailsResponseDTO
	{
		public Guid UserId { get; set; }
		public string UserName { get; set; }
		public string EmailAddress { get; set; }
		public long Phone { get; set; }
		public string Address { get; set; }
		public string ZipCode { get; set; }
		public string City { get; set; }
		public string Country { get; set; }
		public DateTime CreatedOn { get; set; }
	}
}
