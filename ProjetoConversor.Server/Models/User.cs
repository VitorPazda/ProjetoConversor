using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProjetoConversor.Models
{
    public class User
    {
        [Key]
        public int IdUser { get; set; }
        public string Name { get; set; } = string.Empty;
        public string AccountType { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;

        public User()
        {
        }

        public User(int idUser, string name, string accountType, string password)
        {
            IdUser = idUser;
            Name = name;
            AccountType = accountType;
            Password = password;
        }
    }
}
