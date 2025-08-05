using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TammbusinessLayer.Helper;
using TammbusinessLayer.Interfaces;
using TammDataLayer.ClientsDAL;
using static TammDataLayer.ClientsDAL.ClientsDTOs;
using TammDataLayer.Helper;
using TammDataLayer;
using TammDataLayer.Users;

namespace TammbusinessLayer.ClientsCommandsServices
{
    public class ClientsCommandsServices : IClientsCommands
    {
        private readonly TokenHelper _TokenCreator;
        public ClientsCommandsServices(TokenHelper TokenCreator)
        {
            _TokenCreator = TokenCreator;
        }

        private bool DeleteImageFromFileSystem(string imageUrl,string folder)
        {
            string _imagesRootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot",folder);
            try
            {
                var fileName = Path.GetFileName(new Uri(imageUrl).LocalPath);
                var fullImagePath = Path.Combine(_imagesRootPath, fileName);

                if (File.Exists(fullImagePath))
                {
                    File.Delete(fullImagePath);
                    return true;
                }
                else
                {
                    Console.WriteLine("الصورة غير موجودة: " + fullImagePath);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("خطأ أثناء حذف الصورة: " + ex.Message);
            }

            return false;
        }


        public async Task<bool> DeletePersonAndAddressesAndGetImagePathsAsync(int personId)
        {
            try
            {
                string? ImageUrl = await TammDataLayer.Users.UsersQueriesDAL.GetImagePathAsync(personId);
                if (!string.IsNullOrEmpty(ImageUrl))
                {
                    DeleteImageFromFileSystem(ImageUrl, "ClientsImages");
                }


                // استدعاء الدالة التي تحذف وتعيد كل مسارات الصور
                var imageUrls = await TammDataLayer.Users.UsersCommandDAL.DeletePersonAndAddressesAndGetImagePathsAsync(personId);

                // حذف كل الصور من الفايل سيستم
                foreach (var imageUrl in imageUrls)
                {
                    DeleteImageFromFileSystem(imageUrl, "AdImages");
                }
                return true;
            }
            catch
            {
                throw;
            }

        }

        public async Task<string> RegisterAsync(ClientsDTOs.AddClientDTO dto)
        {
            dto.RoleId = 2;
            try
            {
                Factories.RegistrationFactory Factory = new Factories.RegistrationFactory();
                var LoginProvider = Factory.LoginProvider(dto.LoginProviderName);
                int ClientId = await LoginProvider.RegisterAsync(dto);
                if (!string.IsNullOrEmpty(dto.HashedPassword) || !string.IsNullOrWhiteSpace(dto.HashedPassword))
                {
                    return ClientId.ToString();
                }
                //start to create token
                return _TokenCreator.CreateToken(await clsClientsQueries.ClientTokenInfo(ClientId));
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message.ToString());
            }
        }

        public async Task<bool> UpdatePersonImageByUserIdAsync(int userId, string imageUrl)
        {
            try
            {
                return await TammDataLayer.ClientsDAL.clsClientsCommand.UpdatePersonImageByUserIdAsync(userId, imageUrl);
            } catch (Exception)
            {
                throw;
            }
        }

        public async Task UpdateUserProfileAsync(UpdateClientProfileDto dto)
        {
            try
            {
                string? LastHashedPassword = await UsersQueriesDAL.GetHashedPasswordByEmailAsync(dto.HashedPassword);
                if (LastHashedPassword != null && LastHashedPassword == dto.HashedPassword)
                {
                    await TammDataLayer.ClientsDAL.clsClientsCommand.UpdateClientProfileAsync(dto);
                }
                else
                {
                    dto.HashedPassword = PasswordHelper.HashPassword(dto.HashedPassword);
                    await TammDataLayer.ClientsDAL.clsClientsCommand.UpdateClientProfileAsync(dto);

                }

            }
            catch (Exception)
            {
                throw;
            }
        }



    }
}
