using System.Net.Http.Headers;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TammbusinessLayer.Interfaces;
using TammbusinessLayer.Payments;

[ApiController]
[Route("api/[controller]")]
public class PaymentsController : ControllerBase
{
    private readonly IPayments _paymentService;
    private readonly PayPalClient _payPalClient;

    // تم إضافة PayPalClient كـ dependency injection هنا
    public PaymentsController(IPayments paymentService, PayPalClient payPalClient)
    {
        _paymentService = paymentService;
        _payPalClient = payPalClient ?? throw new ArgumentNullException(nameof(payPalClient));
    }

    [HttpPost("verify")]
    [Authorize]
    public async Task<IActionResult> VerifyOrder([FromBody] VerifyOrderRequest request)
    {
        if (string.IsNullOrEmpty(request.OrderId))
            return BadRequest("OrderId is required.");

        var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
        int clientId = await TammDataLayer.Users.UsersQueriesDAL.GetClientIdByUserId(int.Parse(userIdStr));
        request.ClientId = clientId;

        // تحقق من حالة الطلب مع PayPal
        var order = await _payPalClient.GetOrderAsync(request.OrderId);

        if (order == null
            || order.Status != "COMPLETED"
            || order.PurchaseUnits == null
            || !order.PurchaseUnits.Any()
            || order.PurchaseUnits[0].Amount == null
            || string.IsNullOrEmpty(order.PurchaseUnits[0].Amount.Value))
        {
            var orderJson = Newtonsoft.Json.JsonConvert.SerializeObject(order);
            Console.WriteLine("PayPal order data: " + orderJson);
            return BadRequest("Payment not completed or order details are invalid.");
        }
        int amountOfCoins = request.AmountOfCoins;
        int paymentMethodId = request.PaymentMethodId;
        decimal totalCost = decimal.Parse(order.PurchaseUnits[0].Amount.Value);

        // سجل الدفع في الداتا بيز
        bool success = await _paymentService.AddPaymentAsync(clientId, amountOfCoins, paymentMethodId, totalCost);

        if (success)
            return Ok(new { message = "Payment recorded successfully." });
        else
            return StatusCode(500, "Failed to record payment.");
    }
}

public class VerifyOrderRequest
{
    public string OrderId { get; set; }
    public int ClientId { get; set; }
    public int AmountOfCoins { get; set; }
    public int PaymentMethodId { get; set; }
}
