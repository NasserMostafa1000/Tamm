using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TammbusinessLayer.Interfaces;

namespace TammBackendProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUsersCommands _UsersCommand;
        private readonly IUserQueries _UsersQueries;

        public UsersController(IUsersCommands usersCommand, IUserQueries UsersQueries)
        {
            _UsersCommand = usersCommand;
            _UsersQueries = UsersQueries;
        }
        [HttpPost("BlockPerson")]
        [Authorize(Roles ="Admin")]
        public async Task<IActionResult> BlockPerson(int personId)
        {
            try
            {
                bool success = await _UsersCommand.BlockPersonAsync(personId);
                if (!success)
                    return NotFound("User not found or already blocked.");

                return Ok("User blocked successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal error: {ex.Message}");
            }
        }

        [HttpGet("GetAllEmails")]
        [Authorize (Roles ="Admin")]
        public async Task<ActionResult<List<string>>> GetAllEmails()
        {
            try
            {
                var emails = await _UsersQueries.GetAllUserEmailsAsync();
                return Ok(emails);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error fetching emails: {ex.Message}");
            }
        }
    }
}
