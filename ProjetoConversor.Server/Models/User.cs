using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProjetoConversor.Models
{
    public class User
    {
        [Key]
        public int IdUser { get; set; }
        public string Name { get; set; }
        public string AccountType { get; set; }
        public string Password { get; set; }

        public User(int idUser, string name, string accountType, string password)
        {
            IdUser = idUser;
            Name = name;
            AccountType = accountType;
            Password = password;
        }
    }
}
