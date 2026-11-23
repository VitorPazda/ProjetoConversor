using System.ComponentModel.DataAnnotations;

namespace ProjetoConversor.Server.Models
{
    public class ConversionResponseDto
    {
        public int IdConversion { get; set; }
        public int UserId { get; set; }
        public string UserName { get; set; } = string.Empty;
        public string Bank { get; set; } = string.Empty;
        public string FileName { get; set; } = string.Empty;
        public DateTime Date { get; set; }
        public string Status { get; set; } = string.Empty;
    }
}

