using System.Net.Http.Headers;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using TammbusinessLayer.Coins;
using TammbusinessLayer.Interfaces;
using TammbusinessLayer.Payments;
using TammDataLayer;
using TammDataLayer.Chat;
using TammDataLayer.Coins;
using TammDataLayer.Users;
using static TammDataLayer.Payments.PendingPayments;

[ApiController]
[Route("api/[controller]")]
public class PaymentsController : ControllerBase
{
    private readonly IPayments _paymentService;
    private readonly IPendingPayments _PendingPaymentService;
    private readonly IHubContext<ChatHub> _chatHub;
    private readonly PayPalClient _payPalClient;

    public PaymentsController(IPayments paymentService, IHubContext<ChatHub> chatHub, PayPalClient payPalClient,IPendingPayments PendingPayments)
    {
        _paymentService = paymentService;
        _payPalClient = payPalClient ?? throw new ArgumentNullException(nameof(payPalClient));
        _PendingPaymentService = PendingPayments;
        _chatHub = chatHub;
    }


    [HttpPost("webhook")]
    public async Task<IActionResult> Webhook()
    {
        using var reader = new StreamReader(Request.Body);
        var body = await reader.ReadToEndAsync();

        dynamic webhookEvent = Newtonsoft.Json.JsonConvert.DeserializeObject(body);
        string eventType = webhookEvent.event_type;

        var time = DateTime.UtcNow;

        switch (eventType)
        {
            case "PAYMENT.CAPTURE.PENDING":
                {
                    return Ok();
                }
            case "PAYMENT.CAPTURE.COMPLETED":
                {
                    string orderId = webhookEvent.resource.id;
                    var pendingPayment = await _PendingPaymentService.GetPendingOrderByIdAsync(orderId);

                    if (pendingPayment != null)
                    {
                        // Add payment and refund coins
                        bool paymentAddedSuccess = await _paymentService.AddPaymentAsync(
                            pendingPayment.ClientId,
                            pendingPayment.AmountOfCoins,
                            pendingPayment.PaymentMethodId,
                            pendingPayment.TotalCostAED,
                            orderId

                            );

                        // بعد ما خلصنا، نمسح من Pending
                        await _PendingPaymentService.DeletePendingOrderByIdAsync(orderId);

                        // نجيب اليوزر
                        int userId = await UsersQueriesDAL.GetUserIdByClientId(pendingPayment.ClientId);

                        if (paymentAddedSuccess)
                        {
                            string PaymentCompletedMessage =
                                $"🎉 Payment successful! (Order ID: {orderId}) " +
                                $"{pendingPayment.AmountOfCoins} coins have been credited to your account. " +
                                $"Total paid: {pendingPayment.TotalCostAED} AED. " +
                                "Thank you for your purchase!";

                            // سجل الرسالة في الداتابيس
                            await ChatDAL.InsertMessageAsync(Settings.AdminId, userId, null, PaymentCompletedMessage);

                            // ابعتها بالـ SignalR
                            await _chatHub.Clients.User(userId.ToString()).SendAsync("ReceiveMessage", new
                            {
                                fromUserId = Settings.AdminId,
                                toUserId = userId,
                                message = PaymentCompletedMessage,
                                sentAt = time
                            });

                            return Ok(new { message = "Payment recorded and user notified successfully." });
                        }
                        else
                        {
                            return StatusCode(500, "Failed to record payment.");
                        }
                    }
                    break;
                }
            default:
                break;
        }

        return Ok();
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
        var order = await _payPalClient.GetOrderAsync(request.OrderId);

        int amountOfCoins = request.AmountOfCoins;
        int paymentMethodId = request.PaymentMethodId;
        decimal totalCostUsd = decimal.Parse(order.PurchaseUnits[0].Amount.Value);
        decimal coinRate = await Settings.GetCoinRate(); // سعر الكوين بالدرهم
        decimal expectedCostAED = coinRate * amountOfCoins; // التكلفة بالدرهم
        decimal usdRate = 0.27m; // ثابت: 1 درهم = 0.27 دولار
        decimal expectedCostUSD = expectedCostAED * usdRate; // التحويل إلى دولار
        int UserId =await  UsersQueriesDAL.GetUserIdByClientId(clientId);

        var time = DateTime.UtcNow;
       
        if (order.Status.ToUpper()=="PENDING")
        {
            //this will add the Payment Details to Vesical Table and waiting Paypal Response for ensure the payment are fundded succfully     
            await _PendingPaymentService.AddPendingOrderAsync(
               new TammDataLayer.Payments.PendingPayments.PendingOrder
               {
                   PayPalOrderId = request.OrderId,
                   ClientId = clientId,
                   PaymentMethodId = paymentMethodId,
                   AmountOfCoins = amountOfCoins,
                   TotalCostAED = expectedCostAED
               });

            string PaymentPendingMessage =
                $"⏳ Your payment (Order ID: {request.OrderId}) of {amountOfCoins} coins " +
                $"using payment method #{paymentMethodId} is pending confirmation. " +
                $"Amount charged: {expectedCostAED} AED (~{expectedCostUSD:F2} USD). " +
                "The amount has been deducted from your card, and PayPal is securely verifying the transaction. " +
                "This is normal and may take a short while. ✅ We will notify you once the payment is fully confirmed.";
            await ChatDAL.InsertMessageAsync(Settings.AdminId, UserId, null, PaymentPendingMessage);
            await _chatHub.Clients.User(UserId.ToString()).SendAsync("ReceiveMessage", new
            {
                fromUserId = Settings.AdminId,
                toUserId = UserId,
                message = PaymentPendingMessage,
                sentAt = time
            });

            return Ok(new { message = "Payment recorded successfully." });

        }
        if (order == null
            || order.Status != "COMPLETED"
            || order.PurchaseUnits == null
            || !order.PurchaseUnits.Any()
            || order.PurchaseUnits[0].Amount == null
            || string.IsNullOrEmpty(order.PurchaseUnits[0].Amount.Value))
        {
            var orderJson = Newtonsoft.Json.JsonConvert.SerializeObject(order);
            return BadRequest("Payment not completed or order details are invalid.");
        }
       
 
        if (Math.Abs(totalCostUsd - expectedCostUSD) > 5m)
        {
            return BadRequest("Invalid payment amount. Possible tampering detected.");
        }


        string PaymentCompletedMessage =
            $"🎉 Payment successful! (Order ID: {request.OrderId}) " +
            $"{amountOfCoins} coins have been credited to your account. " +
            $"Total paid: {expectedCostAED} AED (~{expectedCostUSD:F2} USD) " +
            "Thank you for your purchase!";
        await ChatDAL.InsertMessageAsync(Settings.AdminId, UserId, null, PaymentCompletedMessage);
        await _chatHub.Clients.User(UserId.ToString()).SendAsync("ReceiveMessage", new
        {
            fromUserId = Settings.AdminId,
            toUserId = UserId,
            message = PaymentCompletedMessage,
            sentAt = time
        });
        bool success = await _paymentService.AddPaymentAsync(clientId, amountOfCoins, paymentMethodId, expectedCostAED, request.OrderId);

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
