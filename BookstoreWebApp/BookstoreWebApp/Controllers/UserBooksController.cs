using BookstoreWebApp.Data;
using BookstoreWebApp.Models.Domain;
using BookstoreWebApp.Models.DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BookstoreWebApp.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	[EnableCors("AllowBookstoreCors")]
	[Authorize]
	public class UserBooksController : ControllerBase
	{
		private readonly BookstoreWebAppDbContext _booksdbcontext;
		public UserBooksController(BookstoreWebAppDbContext booksdbcontext)
		{
			this._booksdbcontext = booksdbcontext;
		}

		// CRUD Operations on Books Starts here

		// Adding new Book to the Books Table
		[HttpPost("addNewBook")]
		public async Task<IActionResult> addNewBookRequest([FromBody] AddBookRequestDTO _addBookRequestDTO)
		{
			var Book = await _booksdbcontext.Books.FirstOrDefaultAsync(x => x.ISBNNumber == _addBookRequestDTO.ISBNNumber);

			if (Book != null)
			{
				return StatusCode(401, "Book Already Exists");
			}
			else
			{
				var newBook = new Books
				{
					BookId = Guid.NewGuid(),
					Author = _addBookRequestDTO.Author,
					Title = _addBookRequestDTO.Title,
					Synopsis = _addBookRequestDTO.Synopsis,// Newly added Column
					PublishedOn = _addBookRequestDTO.PublishedOn,
					Price = _addBookRequestDTO.Price,
					PublishedBy	= _addBookRequestDTO.PublishedBy,
					ISBNNumber = _addBookRequestDTO.ISBNNumber,
					UserId = _addBookRequestDTO.UserId,
					CreatedOn = DateTime.Now,
					UpdatedOn = DateTime.Now
				};
				
				await _booksdbcontext.Books.AddAsync(newBook);
				await _booksdbcontext.SaveChangesAsync();

				var _addBookResponseDTO = new AddBookResponseDTO
				{
					BookId = newBook.BookId,
					Author = newBook.Author,
					UserId = newBook.UserId,
					CreatedOn = newBook.CreatedOn
				};
				return StatusCode(200, _addBookResponseDTO);

			}
		}

		[HttpGet("getAllBooks/{UserId}")]
		public async Task<IActionResult> getAllBooks([FromRoute] Guid UserId)
		{
			var userBooks = await _booksdbcontext.Books.Where(u => u.UserId == UserId)
				.Select(u => new
				{
					u.Title,
					u.Author,
					u.Price,
					u.ISBNNumber
					
				}).ToListAsync();

			if (userBooks != null)
			{
				var _userBooksSummaryDTO = userBooks.Select(books => new UserBooksSummayDTO
				{
					Title = books.Title,
					Author = books.Author,
					Price = books.Price,
					ISBNNumber = books.ISBNNumber
					
				}).ToList();
				
				return StatusCode(200,_userBooksSummaryDTO);
			}
			else
			{
				return StatusCode(400,"No Books Found");
			}
		}

		[HttpPut("updateBook")]
		public async Task<IActionResult> updateBookDetail(EditBookRequestDTO _editBookRequestDTO)
		{
			var book = await _booksdbcontext.Books.Where(b => 
			b.UserId == _editBookRequestDTO.UserId && b.ISBNNumber == _editBookRequestDTO.ISBNNumber)
				.FirstOrDefaultAsync();

			if(book == null)
			{
				return StatusCode(401,"Book Not Found");
			}
			else
			{
				book.Title = _editBookRequestDTO.Title;
				book.Author = _editBookRequestDTO.Author;
				book.Synopsis = _editBookRequestDTO.Synopsis;
				book.PublishedOn = _editBookRequestDTO.PublishedOn;
				book.Price = _editBookRequestDTO.Price;
				book.PublishedBy = _editBookRequestDTO.PublishedBy;
				book.ISBNNumber = _editBookRequestDTO.ISBNNumber;
				book.UpdatedOn = DateTime.Now;

				await _booksdbcontext.SaveChangesAsync();

				//return StatusCode(200,"Update Successful");
				return Ok(new {message = "Update Successful"});
			}
				
		}

		[HttpDelete("deleteBook/{isbnNumber}/{userId}")]
		public async Task<IActionResult> deleteBook([FromRoute] string isbnNumber, [FromRoute] Guid userId)
		{
			var book = await _booksdbcontext.Books.FirstOrDefaultAsync(b => b.UserId == userId && b.ISBNNumber == isbnNumber);
			
			if(book == null)
			{
				return StatusCode(404,"Book Not Found");
			}
			else
			{
				_booksdbcontext.Books.Remove(book);
				await _booksdbcontext.SaveChangesAsync();

				//return StatusCode(200,"Deleted Successfully");
				return Ok(new { message = "Deleted Successfully" });
			}
		}

		// Getting detail of the book
		[HttpGet("getUserBookDetail/{isbnNumber}/{userId}")]
		public async Task<IActionResult> getUserBookDetail([FromRoute] string isbnNumber, [FromRoute] Guid userId)
		{
			var book = await _booksdbcontext.Books.Where(b => b.ISBNNumber == isbnNumber 
			&& b.UserId== userId).
			Select(
				bd => new
				{
				
					bd.BookId,
					bd.Title,
					bd.Author ,
					bd.Synopsis,
					bd.PublishedOn,
					bd.Price,
					bd.PublishedBy,
					bd.ISBNNumber,
					bd.UserId 
				}).FirstOrDefaultAsync();
			if(book == null)
			{
				return StatusCode(404,"Record not found");
			}
			else
			{
				return StatusCode(200,book);
			}
		}
		
	}
}
