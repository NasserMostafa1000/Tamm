using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

public class PayPalClient
{
    private readonly HttpClient _httpClient;
    private readonly string _clientId = "AbaYFaxibJgq266zJBB_hy3PLXvpIMe-EZBMYv_6-S_VncjSAuKdwzVMA92I5KeRtvBEYSaWdNUFEYHG";
    private readonly string _clientSecret = "EKryY2pZn4Y-pe5T91K7cRmHIQang3H3kvbQapVB7Cq1TilYzoBs7AfLM7-QyICZJB4TlFbe2v7_lyAS";

    private string _accessToken;
    private DateTime _accessTokenExpiration;

    public PayPalClient(HttpClient httpClient)
    {
        _httpClient = httpClient ?? throw new ArgumentNullException(nameof(httpClient));
        _httpClient.BaseAddress = new Uri("https://api-m.paypal.com/");
    }

    private async Task<string> GetAccessTokenAsync()
    {
        // تحقق من صلاحية التوكن لتقليل طلبات الـ API
        if (!string.IsNullOrEmpty(_accessToken) && _accessTokenExpiration > DateTime.UtcNow.AddMinutes(1))
        {
            return _accessToken;
        }

        var basicAuth = Convert.ToBase64String(Encoding.UTF8.GetBytes($"{_clientId}:{_clientSecret}"));
        var request = new HttpRequestMessage(HttpMethod.Post, "v1/oauth2/token");
        request.Headers.Authorization = new AuthenticationHeaderValue("Basic", basicAuth);
        request.Content = new FormUrlEncodedContent(new Dictionary<string, string>
        {
            { "grant_type", "client_credentials" }
        });

        var response = await _httpClient.SendAsync(request);
        response.EnsureSuccessStatusCode();
        var json = await response.Content.ReadAsStringAsync();

        dynamic data = JsonConvert.DeserializeObject(json);
        _accessToken = data.access_token;
        int expiresIn = data.expires_in;
        _accessTokenExpiration = DateTime.UtcNow.AddSeconds(expiresIn);

        return _accessToken;
    }

    public async Task<PayPalOrder> GetOrderAsync(string orderId)
    {
        var token = await GetAccessTokenAsync();

        var request = new HttpRequestMessage(HttpMethod.Get, $"v2/checkout/orders/{orderId}");
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);

        var response = await _httpClient.SendAsync(request);
        if (!response.IsSuccessStatusCode)
            return null;

        var json = await response.Content.ReadAsStringAsync();
        return JsonConvert.DeserializeObject<PayPalOrder>(json);
    }
}

public class PayPalOrder
{
    [JsonProperty("id")]
    public string Id { get; set; }

    [JsonProperty("status")]
    public string Status { get; set; }

    [JsonProperty("purchase_units")]
    public List<PurchaseUnit> PurchaseUnits { get; set; }
}

public class PurchaseUnit
{
    [JsonProperty("amount")]
    public Amount Amount { get; set; }
}

public class Amount
{
    [JsonProperty("currency_code")]
    public string CurrencyCode { get; set; }

    [JsonProperty("value")]
    public string Value { get; set; }
}
