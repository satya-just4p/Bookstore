namespace BookstoreWebApp.Models.DTO
{
	public class EditUserRequestDTO
	{
		public string UserName { get; set; }
		public long Phone { get; set; }
		public string Address { get; set; }
		public string ZipCode { get; set; }
		public string City { get; set; }
		public string Country { get; set; }
		
	}
}
