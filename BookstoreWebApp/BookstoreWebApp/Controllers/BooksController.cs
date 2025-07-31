using BookstoreWebApp.Data;
using BookstoreWebApp.Models.DTO;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BookstoreWebApp.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	[EnableCors("AllowBookstoreCors")]
	public class BooksController : ControllerBase
	{
		private readonly BookstoreWebAppDbContext _dbContext;

		public BooksController(BookstoreWebAppDbContext dbContext)
		{
			this._dbContext = dbContext;
		}

		

		// Listing all Books that will be displayed on the index page.
		[HttpGet("getBooksSummary")]
		public async Task<IActionResult> getBooksSummary()
		{
			var books = await _dbContext.Books.Select(b => 
			new {
				b.Title,b.Author,b.Price,b.ISBNNumber
			}).ToListAsync();

			return StatusCode(200,books);
		}

		[HttpGet("getBookDetail/{isbnNUmber}")]
		public async Task<IActionResult> getBookDetail([FromRoute] string isbnNumber)
		{
			var bookCheck = await _dbContext.Books.Where(b => b.ISBNNumber == isbnNumber)
				.Select(
					d => new
					{
						d.BookId,
						d.Title,
						d.Author,
						d.Synopsis,
						d.PublishedOn,
						d.PublishedBy,
						d.Price,
						d.ISBNNumber
					}
				).FirstOrDefaultAsync();
			if (bookCheck != null)
			{
				var _bookDetailPageDTO = new BookDetailPageDTO
				{
					BookId = bookCheck.BookId,
					Title = bookCheck.Title,
					Author = bookCheck.Author,
					Synopsis = bookCheck.Synopsis,
					PublishedOn = bookCheck.PublishedOn,
					PublishedBy = bookCheck.PublishedBy,
					Price = bookCheck.Price,
					ISBNNumber = bookCheck.ISBNNumber
				};
				return StatusCode (200,_bookDetailPageDTO);
			}
			else
			{
				return StatusCode(404,"Record Not Found");
			}
		}

	}
}
