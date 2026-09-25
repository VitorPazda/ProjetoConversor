using System.ComponentModel.DataAnnotations;

namespace ProjetoConversor.Models
{
    public class User
    {
        [Key]
        public int IdUser { get; set; }
        public string Name { get; set; } = string.Empty;
        public string AccountType { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public bool Active { get; set; } = false;

        public User()
        {
        }

        public User(int idUser, string name, string accountType, string password, bool active)
        {
            IdUser = idUser;
            Name = name;
            AccountType = accountType;
            Password = password;
            Active = active;
        }
    }
}
