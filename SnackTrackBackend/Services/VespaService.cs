using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;

namespace SnackTrackBackend.Services
{
    public class VespaService
    {
        private readonly HttpClient _httpClient;
        private readonly string _vespaUrl;

        public VespaService(HttpClient httpClient, IConfiguration config)
        {
            _httpClient = httpClient;

            // Read directly from environment variables
            _vespaUrl = config["VESPA_URL"] ?? throw new ArgumentNullException("VESPA_URL");
            var token = config["VESPA_WORKSHOP_TOKEN"] ?? throw new ArgumentNullException("VESPA_WORKSHOP_TOKEN");

            _httpClient.DefaultRequestHeaders.Authorization = 
                new AuthenticationHeaderValue("Bearer", token);
        }

        public async Task<string> SearchProductsAsync(string query)
        {
            // Use the workshop YQL query for products
            var yql = "select * from product.product where userQuery() limit 10;";
            var url = $"{_vespaUrl}/search/?yql={Uri.EscapeDataString(yql)}&query={Uri.EscapeDataString(query)}";

            var response = await _httpClient.GetAsync(url);
            response.EnsureSuccessStatusCode();

            return await response.Content.ReadAsStringAsync();
        }
    }
}
