namespace BookstoreWebApp.Models.DTO
{
	public class EditBookResponseDTO
	{
		public Guid BookId { get; set; }
		public string Title { get; set; }
		public Guid UserId { get; set; }
		public DateTime UpdatedOn { get; set; }
	}
}
