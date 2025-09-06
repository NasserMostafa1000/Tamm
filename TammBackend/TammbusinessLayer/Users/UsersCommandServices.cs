using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TammbusinessLayer.Factories;
using TammbusinessLayer.Interfaces;
using TammDataLayer;
using TammDataLayer.Helper;
using TammDataLayer.Users;

namespace TammbusinessLayer.Users
{
    public class UsersCommandServices : IUsersCommands
    {
        public async Task<bool> BlockPersonAsync(int personId)
        {
           try
            {
                return await TammDataLayer.Users.UsersCommandDAL.BlockPersonAsync(personId);
            }catch
            {
                throw;
            }
        }

        public async Task<int> UpdatePasswordWithEmailAsync(     string email,     string notifierId,string language,string notificationProviderName 
        )
        {
            try
            {
                // 1- إنشاء باسورد جديد عشوائي
                string newPassword = PasswordHelper.GenerateRandomPassword();

                // 2- عمل Hash للباسورد
                string hashedPassword = PasswordHelper.HashPassword(newPassword);

                // 3- تحديث في قاعدة البيانات
                bool passwordUpdated = await UsersCommandDAL.UpdatePasswordWithEmailAsync(email, hashedPassword, language) > 0;

                if (passwordUpdated)
                {
                    // 4- اختيار وسيلة الإشعار (Gmail / SMS)
                    INotification notifier = new NotificationsFactory().GetNotificationSender(notificationProviderName);

                    // 5- إرسال الباسورد الجديد للمستخدم
                    string subject = language == "ar" ? "إعادة تعيين كلمة المرور" : "Password Reset";
                    string body = language == "ar"
                        ? $"كلمة المرور الجديدة الخاصة بك هي: {newPassword}"
                        : $"Your new password is:    {newPassword}";
                    //this belongs to the frontend site that user registered on it cause this backend services many sites
                    string CurrentUserSiteName =await UsersQueriesDAL.GetLoginProviderNameByEmailAsync(email);
                    await notifier.SendNotificationAsync(notifierId, subject, body, CurrentUserSiteName);

                    return 1; // نجح
                }

                return 0; // فشل (إيميل مش موجود مثلاً)
            }
            catch
            {
                throw;
            }
        }


    }
}
