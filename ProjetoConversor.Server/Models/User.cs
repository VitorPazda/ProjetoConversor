using System.ComponentModel.DataAnnotations;

namespace ProjetoConversor.Models
{
    public class User
    {
        [Key]
        public int IdUser { get; set; }

        [Required]
        public string Name { get; set; } = string.Empty;

        [Required]
        public string AccountType { get; set; } = string.Empty;

        [Required]
        public string Username { get; set; } = string.Empty;
        
        [Required]
        public string Password { get; set; } = string.Empty;

        [Required]
        public bool Active { get; set; } = false;

        public User()
        {
        }

        public User(string name, string accountType, string username, string password, bool active)
        {
            Name = name;
            AccountType = accountType;
            Username = username;
            Password = password;
            Active = active;
        }
    }
}
