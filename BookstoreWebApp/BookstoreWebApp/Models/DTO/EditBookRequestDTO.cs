using BookstoreWebApp.Models.Domain;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookstoreWebApp.Models.DTO
{
	public class EditBookRequestDTO
	{
		public Guid BookId { get; set; } // This is a readonly field
		public string Title { get; set; }
		public string Author { get; set; }
		public string Synopsis { get; set; }
		public DateTime PublishedOn { get; set; }
		public double Price { get; set; }
		public string PublishedBy { get; set; }
		public string ISBNNumber { get; set; }
		public Guid UserId { get; set; }// This is also a read only field
		
	}
}
