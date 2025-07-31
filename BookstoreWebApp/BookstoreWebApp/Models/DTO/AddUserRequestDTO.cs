namespace BookstoreWebApp.Models.DTO
{
	public class AddUserRequestDTO
	{
		public string UserName { get; set; }
		public string EmailAddress { get; set; }
		public string PasswordPlainText { get; set; }
		public long Phone { get; set; }
		public string Address { get; set; }
		public string ZipCode { get; set; }
		public string City { get; set; }
		public string Country { get; set; }
		
	}
}
