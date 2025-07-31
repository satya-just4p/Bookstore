namespace BookstoreWebApp.Models.DTO
{
	public class BookSummaryDTO
	{
		// These details are displayed on the index page of the Angular UI with ISBNNumber as a link
		public string Title { get; set; }
		public string Author { get; set; }
		public double Price { get; set; }
		public string ISBNNumber { get; set; }


	}
}
