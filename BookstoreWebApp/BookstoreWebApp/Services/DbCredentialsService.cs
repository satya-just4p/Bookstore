using Amazon.SimpleSystemsManagement;
using Amazon.SimpleSystemsManagement.Model;

namespace BookstoreWebApp.Services
{
	public class DbCredentialsService
	{
		private readonly IAmazonSimpleSystemsManagement _ssm;

		public DbCredentialsService()
		{
			_ssm = new AmazonSimpleSystemsManagementClient();
		}

		private async Task<string> Get(string name)
		{
			var response = await _ssm.GetParameterAsync(new GetParameterRequest
			{
				Name = name,
				WithDecryption = true
			});

			return response.Parameter.Value;
		}

		public async Task<string> GetConnectionStringAsync()
		{
			var host = await Get("/rds/host"); // RDS EndPoint
			var db = await Get("/rds/name"); // Database Name
			var username = await Get("/rds/username"); // DB UserName
			var password = await Get("/rds/password"); //DB Password

			return $"Server={host};database={db};user id={username};password={password};TrustServerCertificate=true";
		}
	}
}
