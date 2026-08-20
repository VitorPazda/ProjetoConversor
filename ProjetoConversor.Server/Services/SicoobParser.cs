using System.Globalization;
using System.Text.RegularExpressions;
using ProjetoConversor.Server.Models;

namespace ProjetoConversor.Server.Services
{
    public class SicoobParser
    {
        public List<BankTransaction> Parse(string text)
        {
            var transactions = new List<BankTransaction>();

            var pattern =
                @"(?<date>\d{2}/\d{2}/\d{4})" +
                @"(?<content>.*?)" +
                @"(?<amount>\d{1,3}(?:\.\d{3})*,\d{2})(?<operation>[CD])";

            var matches = Regex.Matches(
                text,
                pattern,
                RegexOptions.Singleline
            );

            foreach (Match match in matches)
            {
                var dateText = match.Groups["date"].Value;
                var content = match.Groups["content"].Value.Trim();
                var amountText = match.Groups["amount"].Value;
                var operation = match.Groups["operation"].Value;

                var date = DateTime.ParseExact(
                    dateText,
                    "dd/MM/yyyy",
                    CultureInfo.InvariantCulture
                );

                var amount = decimal.Parse(
                    amountText,
                    new CultureInfo("pt-BR")
                );

                if (operation == "D")
                {
                    amount *= -1;
                }

                // Separa número/documento do histórico
                var checkNumber = "";
                var memo = content;

                var documentMatch = Regex.Match(
                    content,
                    @"^(?<doc>\d{3,})(?<memo>.+)$"
                );

                if (documentMatch.Success)
                {
                    checkNumber = documentMatch.Groups["doc"].Value;
                    memo = documentMatch.Groups["memo"].Value.Trim();
                }

                // Pequena limpeza do texto
                memo = memo
                    .Replace("PixPIX", "PIX")
                    .Replace("MASTERCARDDÉB", "MASTERCARD DÉB")
                    .Trim();

                var transaction = new BankTransaction
                {
                    Date = date,
                    Amount = amount,
                    Type = operation == "C"
                        ? "CREDIT"
                        : "DEBIT",
                    CheckNumber = checkNumber,
                    Memo = memo,
                    FitId = ""
                };

                transactions.Add(transaction);
            }

            return transactions;
        }
    }
}