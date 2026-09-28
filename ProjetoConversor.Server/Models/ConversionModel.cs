using System.ComponentModel.DataAnnotations;

namespace ProjetoConversor.Models
{
    public class ConversionModel
    {
        [Key]
        public int IdConversion { get; set; }
        public int UserId { get; set; } = 0;
        public string Bank { get; set; } = string.Empty;
        public string FileName { get; set; } = string.Empty;
        public DateTime Date { get; set; }
        public string Status { get; set; } = string.Empty;

        public ConversionModel()
        {
        }

        public ConversionModel(int userId, string bank, string fileName, DateTime date, string status)
        {
            UserId = userId;
            Bank = bank;
            FileName = fileName;
            Date = date;
            Status = status;
        }
    }
}
