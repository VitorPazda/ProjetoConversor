using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProjetoConversor.Models
{
    public class ConversionModel
    {
        [Key]
        public int IdConversion { get; set; }
        public int UserId { get; set; }
        public string Bank { get; set; }
        public string FileName { get; set; }
        public DateTime Date { get; set; }
        public string Status { get; set; }
    }
}
