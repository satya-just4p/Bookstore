using BookstoreWebApp.Models.Domain;
using Microsoft.EntityFrameworkCore;

namespace BookstoreWebApp.Data
{
    public class BookstoreWebAppDbContext:DbContext
	{
        public BookstoreWebAppDbContext(DbContextOptions options):base(options)
        {
            
        }
        public DbSet<Users> Users { get; set; }
        public DbSet<Books> Books { get; set; }

    }
}
