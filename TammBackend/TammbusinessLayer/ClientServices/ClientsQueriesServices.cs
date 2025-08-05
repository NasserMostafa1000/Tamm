using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TammbusinessLayer.Interfaces;
using TammDataLayer.ClientsDAL;
using TammDataLayer.Helper;
using static TammDataLayer.ClientsDAL.ClientsDTOs;

namespace TammbusinessLayer.ClientServices
{
    public class ClientsQueriesServices : IClientQueries
    {
        private readonly Helper.TokenHelper _tokenHelper;
        public ClientsQueriesServices(Helper.TokenHelper tokenCreatror)
        {
            _tokenHelper = tokenCreatror;
        }

        public Task<PagedClientsResultDto> GetClientsPagedAsync(int pageNumber, int pageSize=50)
        {
            try
            {
                return TammDataLayer.ClientsDAL.clsClientsQueries.GetClientsPagedAsync(pageNumber, pageSize);
            }
            catch
            {
                throw;
            }
        }

        public async Task<string?> GetImageUrlByUserIdAsync(int userId)
        {
            try
            {
              return await  TammDataLayer.ClientsDAL.clsClientsQueries.GetImageUrlByUserIdAsync(userId);
            }catch(Exception)
            {
                throw;
            }
        }

        public async  Task<ClientsDTOs.ClientData> GetUserDetailsByIdAsync(int userId)
        {
            try
            {
               return await TammDataLayer.ClientsDAL.clsClientsQueries.GetClientDetailsByUserIdAsync(userId);
            }catch(Exception)
            {
                throw;
            }
        }
        public async Task<string> TryLoginAsync(string email, string plainPassword, string Lang)
        {
            try
            {
                var hashed = await TammDataLayer.Users.UsersQueriesDAL.GetHashedPasswordByEmailAsync(email);

                if (hashed == null)
                {
                    throw new Exception(Lang == "ar"
                        ? "البريد الإلكتروني غير مسجل"
                        : "Email is not registered");
                }

                bool isValid = PasswordHelper.VerifyPassword(plainPassword, hashed);
                if (!isValid)
                {
                    throw new Exception(Lang == "ar"
                        ? "كلمة المرور غير صحيحة"
                        : "Incorrect password");
                }

                var userInfo = await TammDataLayer.ClientsDAL.clsClientsQueries.GetClientTokenInfoByEmailAsync(email);

                if (userInfo == null)
                {
                    throw new Exception(Lang == "ar"
                        ? "تعذر جلب بيانات المستخدم"
                        : "Failed to retrieve user data");
                }

                return _tokenHelper.CreateToken(userInfo);
            }
            catch (Exception ex)
            {
                // ممكن تضيف Logging هنا لو حبيت
                throw new Exception(ex.Message.ToString());
            }
        }

    }
}
