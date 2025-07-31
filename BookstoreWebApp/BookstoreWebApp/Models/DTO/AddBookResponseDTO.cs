namespace BookstoreWebApp.Models.DTO
{
	public class AddBookResponseDTO
	{
		public Guid BookId { get; set; }
		public string Author { get; set; }
		public Guid UserId { get; set; }
		public DateTime CreatedOn { get; set; }
	}
}
