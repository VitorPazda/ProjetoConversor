namespace ProjetoConversor.Server.Models
{
    public class BankStatement
    {
        public string BankId { get; set; } = string.Empty;
        public string BankName { get; set; } = string.Empty;
        public string BranchId { get; set; } = string.Empty;
        public string AccountId { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public decimal Balance { get; set; }
        public List<BankTransaction> Transactions { get; set; } = new();
    }
}