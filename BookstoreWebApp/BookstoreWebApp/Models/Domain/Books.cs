using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.Extensions.Diagnostics.HealthChecks;

namespace BookstoreWebApp.Models.Domain
{
    public class Books
    {
        [Key]
        public Guid BookId { get; set; }
        public string Title { get; set; }
        public string Author { get; set; }

        public string Synopsis { get; set; } // Newly added column to the Books Table
        public DateTime PublishedOn { get; set; }
        public double Price { get; set; }
        public string PublishedBy { get; set; }
        public string ISBNNumber { get; set; }

        public Users Users { get; set; }

        [ForeignKey("Users")]
        public Guid UserId { get; set; }


        public DateTime CreatedOn { get; set; }
        public DateTime UpdatedOn { get; set; }

    }
}
