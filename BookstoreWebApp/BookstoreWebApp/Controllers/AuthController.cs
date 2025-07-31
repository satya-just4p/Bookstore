using BookstoreWebApp.Data;
using BookstoreWebApp.Models.Domain;
using BookstoreWebApp.Models.DTO;
using BookstoreWebApp.Repositories.Interface;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BookstoreWebApp.Controllers
{
	[EnableCors("AllowBookstoreCors")]
	[Route("api/[controller]")]
	[ApiController]
	
	public class AuthController : ControllerBase
	{
		private readonly BookstoreWebAppDbContext _context;

		// Password Hashing - variable definition
		private readonly PasswordHasher<Users> _hasher = new();

		// Variable for JWT Token
		private readonly IJwtTokenService _jwtTokenService;
		public AuthController(BookstoreWebAppDbContext context,IJwtTokenService jwtTokenService)
		{
			this._context = context;
			this._jwtTokenService = jwtTokenService;
		}

		// User Registration 
		[HttpPost("register")]
		public async Task<IActionResult> addUserRequest([FromBody] AddUserRequestDTO _addUserRequest)
		{
			var checkuser = await _context.Users.FirstOrDefaultAsync(x => x.EmailAddress == _addUserRequest.EmailAddress);

			if(checkuser != null)
			{
				return StatusCode(404, "User already Exists");
			}
			else
			{
				var user = new Users
				{
					UserId = Guid.NewGuid(),
					EmailAddress = _addUserRequest.EmailAddress,
					UserName = _addUserRequest.UserName,
					Phone = _addUserRequest.Phone,
					Address = _addUserRequest.Address,
					ZipCode = _addUserRequest.ZipCode,
					City = _addUserRequest.City,
					Country = _addUserRequest.Country,
					CreatedOn = DateTime.Now,
					UpdatedOn = DateTime.Now,
					
				};
				user.PasswordHash = _hasher.HashPassword(user, _addUserRequest.PasswordPlainText);

				await _context.Users.AddAsync(user);
				await _context.SaveChangesAsync();

				// Returning the response back to the client

				var _addUserResponseDTO = new AddUserResponseDTO
				{
					UserId = user.UserId,
					UserName = user.UserName,
					EmailAddress = user.EmailAddress,
					CreatedOn = user.CreatedOn
				};

				return StatusCode(200, _addUserResponseDTO);
			}
		}

		// User Authentication
		[HttpPost("login")]
		public async Task<IActionResult> userLoginRequest([FromBody] UserLoginRequestDTO _userLoginRequestDTO)
		{
			var checkuser = await _context.Users.FirstOrDefaultAsync(x => x.EmailAddress == _userLoginRequestDTO.EmailAddress);

			if(checkuser == null)
			{
				return StatusCode(404, "Invalid Email Address");
			}
			else
			{
				var result = _hasher.VerifyHashedPassword(checkuser,checkuser.PasswordHash,_userLoginRequestDTO.PasswordPlainText);

				if(result == PasswordVerificationResult.Success)
				{
					// Generating JWT Tokens starts here:
					var token = _jwtTokenService.GenerateToken(checkuser);
					
					var _userLoginResponseDTO = new UserLoginResponseDTO
					{
						UserId = checkuser.UserId,
						EmailAddress = checkuser.EmailAddress,
						UserName = checkuser.UserName,
						Token= token
					};

					return StatusCode(200, _userLoginResponseDTO);
				}
				else
				{
					return StatusCode(400, "Invalid Credentials");
				}

			}
		}

		// User Password Reset
		[HttpPut("userPasswordReset")]
		public async Task<IActionResult> userPasswordResetRequest([FromBody] UserPasswordResetRequestDTO _userPasswordResetRequestDTO)
		{
			var checkemail = await _context.Users.FirstOrDefaultAsync(x => x.EmailAddress == _userPasswordResetRequestDTO.EmailAddress);

			if(checkemail == null)
			{
				return StatusCode(404, "Invalid Email Address");
			}
			else
			{
				// Password Hashing Starts here

				checkemail.PasswordHash = _hasher.HashPassword(checkemail,_userPasswordResetRequestDTO.PasswordPlainText);
				await _context.SaveChangesAsync();

				//return StatusCode(200,"Password Reset Successful");
				return Ok(new { message = "Password Reset Successful" });

			}
		}
	}
}
