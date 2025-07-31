using BookstoreWebApp.Models.Domain;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookstoreWebApp.Models.DTO
{
	public class AddBookRequestDTO
	{
		public string Title { get; set; }
		public string Author { get; set; }
		public string Synopsis { get; set; }
		public DateTime PublishedOn { get; set; }
		public double Price { get; set; }
		public string PublishedBy { get; set; }
		public string ISBNNumber { get; set; }
		public Guid UserId { get; set; }
		
	}
}
