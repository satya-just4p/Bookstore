namespace BookstoreWebApp.Models.DTO
{
	public class BookDetailPageDTO
	{
		// In the front end all these details will be a readonly field
		public Guid BookId { get; set; }
		public string Title { get; set; }
		public string Author { get; set; }
		public string Synopsis { get; set; }
		public DateTime PublishedOn { get; set; }
		public string PublishedBy { get; set; }
		public double Price { get; set; }
		public string ISBNNumber { get; set; }

	}
}
