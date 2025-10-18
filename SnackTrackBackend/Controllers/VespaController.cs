using Microsoft.AspNetCore.Mvc;
using SnackTrackBackend.Services;
using System.Threading.Tasks;

namespace SnackTrackBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class VespaController : ControllerBase
    {
        private readonly VespaService _vespaService;

        public VespaController(VespaService vespaService)
        {
            _vespaService = vespaService;
        }

        // GET: api/vespa/search?query=chocolate
        [HttpGet("search")]
        public async Task<IActionResult> Search([FromQuery] string query)
        {
            if (string.IsNullOrWhiteSpace(query))
                return BadRequest("Query parameter is required.");

            var result = await _vespaService.SearchProductsAsync(query);

            return Content(result, "application/json"); // returns raw JSON from Vespa
        }
    }
}
