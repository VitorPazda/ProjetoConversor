using System.Globalization;
using System.Text.RegularExpressions;
using ProjetoConversor.Server.Models;

namespace ProjetoConversor.Server.Services
{
    public class SicoobParser
    {
        public BankStatement Parse(string text)
        {
            var statement = new BankStatement
            {
                BankId = "756",
                BankName = "BANCO COOPERATIVO SICOOB S.A. - BANCO SICOOB"
            };

            // Agency
            var branchMatch = Regex.Match(text, @"Cooperativa:\s*(?<branch>[\d\-]+)", RegexOptions.IgnoreCase);

            if (branchMatch.Success)
            {
                statement.BranchId = branchMatch.Groups["branch"].Value;
            }

            // Account
            var accountMatch = Regex.Match(text,@"Conta:\s*(?<account>[\d\.\-]+)",RegexOptions.IgnoreCase);

            if (accountMatch.Success)
            {
                statement.AccountId = accountMatch.Groups["account"].Value;
            }

            // Period
            var periodMatch = Regex.Match(text,
                @"Per[ií]odo:\s*" +
                @"(?<start>\d{2}/\d{2}/\d{4})" +
                @"\s*-\s*" +
                @"(?<end>\d{2}/\d{2}/\d{4})",
                RegexOptions.IgnoreCase
            );

            if (periodMatch.Success)
            {
                statement.StartDate =DateTime.ParseExact(periodMatch.Groups["start"].Value,"dd/MM/yyyy",CultureInfo.InvariantCulture);

                statement.EndDate = DateTime.ParseExact(periodMatch.Groups["end"].Value,"dd/MM/yyyy",CultureInfo.InvariantCulture);
            }

            // Transactions
            var pattern =
                @"(?<date>\d{2}/\d{2}/\d{4})" +
                @"(?<content>.*?)" +
                @"(?<amount>\d{1,3}(?:\.\d{3})*,\d{2})" +
                @"(?<operation>[CD])";

            var matches = Regex.Matches(text,pattern,RegexOptions.Singleline);

            foreach (Match match in matches)
            {
                var dateText = match.Groups["date"].Value;

                var content = match.Groups["content"].Value.Trim();

                var amountText = match.Groups["amount"].Value;

                var operation =match.Groups["operation"].Value;

                // Ignore header and balances
                if (content.Contains("EXTRATO CONTA CORRENTE", StringComparison.OrdinalIgnoreCase) || content.Contains("SALDO ANTERIOR",
                    StringComparison.OrdinalIgnoreCase) || content.Contains("SALDO BLOQUEADO ANTERIOR",StringComparison.OrdinalIgnoreCase))
                {
                    continue;
                }

                var date = DateTime.ParseExact(dateText,"dd/MM/yyyy",CultureInfo.InvariantCulture);

                var amount = decimal.Parse(amountText,new CultureInfo("pt-BR"));

                if (operation == "D")
                {
                    amount *= -1;
                }

                var checkNumber = "";
                var memo = content;

                // Simple document or with period
                var documentMatch = Regex.Match(content,@"^(?<doc>\d+(?:\.\d+)?)(?<memo>.+)$");

                if (documentMatch.Success)
                {
                    checkNumber = documentMatch.Groups["doc"].Value;

                    memo = documentMatch.Groups["memo"].Value.Trim();
                }

                // Cleaning up
                memo = memo
                    .Replace("PixPIX", "PIX")
                    .Replace("PixESTORNO", "ESTORNO")
                    .Replace("PixCRÉDITO", "CRÉDITO")
                    .Replace("MASTERCARDDÉB","MASTERCARD DÉB")
                    .Trim();

                var transaction = new BankTransaction
                    {
                        Date = date,
                        Amount = amount,

                        Type = operation == "C" ? "CREDIT": "DEBIT",

                        CheckNumber = checkNumber,
                        Memo = memo
                    };

                statement.Transactions.Add(transaction);
            }

            return statement;
        }
    }
}