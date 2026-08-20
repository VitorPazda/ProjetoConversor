namespace ProjetoConversor.Server.Models
{
    public class BankTransaction
    {
        public DateTime Date { get; set; }
        public decimal Amount { get; set; }
        public string Type { get; set; } = string.Empty;
        public string CheckNumber { get; set; } = string.Empty;
        public string Memo { get; set; } = string.Empty;
        public string FitId { get; set; } = string.Empty;
    }
}
