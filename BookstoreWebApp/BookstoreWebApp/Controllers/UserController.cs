using BookstoreWebApp.Data;
using BookstoreWebApp.Models.Domain;
using BookstoreWebApp.Models.DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BookstoreWebApp.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	[EnableCors("AllowBookstoreCors")]
	[Authorize]
	public class UserController : ControllerBase
	{
		private readonly BookstoreWebAppDbContext _DbContext;

		// Variable declaration for Password hashing
		private readonly PasswordHasher<Users> _PasswordHasher = new();
		public UserController(BookstoreWebAppDbContext DbContext)
		{
			this._DbContext = DbContext;
		}

		// Get User Details
		[HttpGet("getUserDetails/{userId}")]
		public async Task<IActionResult> getUserDetailsRequest([FromRoute] Guid userId)
		{
			var user = await _DbContext.Users.FirstOrDefaultAsync(x => x.UserId == userId);

			if(user == null)
			{
				return StatusCode(404, "Data not found");
			}
			else
			{
				var _getUserDetailsResponseDTO = new GetUserDetailsResponseDTO
				{
					UserId = user.UserId,
					UserName = user.UserName,
					EmailAddress = user.EmailAddress,
					Phone = user.Phone,
					Address = user.Address,
					ZipCode = user.ZipCode,
					City = user.City,
					Country = user.Country,
					CreatedOn = user.CreatedOn

				};
				return StatusCode(200,_getUserDetailsResponseDTO);
			}

		}
		
		// User Updates his profile
		[HttpPut("updateProfile/{UserId}")]
		public async Task<IActionResult> updateUserProfile([FromRoute] Guid UserId,[FromBody] EditUserRequestDTO _editUserRequestDTO)
		{
			var user = await _DbContext.Users.FirstOrDefaultAsync(u => u.UserId == UserId);
			if(user == null)
			{
				return StatusCode(404,"Invalid User");
			}
			else
			{
					
					// User Profile editing starts here
					user.UserName = _editUserRequestDTO.UserName;
					user.Phone = _editUserRequestDTO.Phone;
					user.Address = _editUserRequestDTO.Address;
					user.ZipCode = _editUserRequestDTO.ZipCode;
					user.City = _editUserRequestDTO.City;
					user.Country = _editUserRequestDTO.Country;
					user.UpdatedOn = DateTime.Now;

					await _DbContext.SaveChangesAsync();
									
					return Ok(new {message = "Details updated Successfully"});
				
			}

		}

		[HttpDelete("deleteAccount/{userId}")]
		public async Task<IActionResult> deleteUserAccount([FromRoute] Guid userId)
		{
			var user = await _DbContext.Users.FirstOrDefaultAsync(x => x.UserId == userId);

			if(user!=null)
			{
				//var books = await _DbContext.Books.Where(b => b.UserId == userId).ToListAsync();
				var books = await _DbContext.Books.Where(b => b.UserId == user.UserId).ToListAsync();

				if(books == null || books.Count == 0)
				{
					_DbContext.Users.Remove(user);
					await _DbContext.SaveChangesAsync();
				}
				else
				{
					_DbContext.Books.RemoveRange(books);
					await _DbContext.SaveChangesAsync();

					_DbContext.Users.Remove(user);
					await _DbContext.SaveChangesAsync();

				}
				//return StatusCode(200, "Your Account Deleted Successfully");
				return Ok(new { message = "Your Account Deleted Successfully" });
			}
			else
			{
				return StatusCode(404,"User Data Not Found");
			}
		}
	}
}
