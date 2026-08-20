using System.Globalization;
using System.Text;
using ProjetoConversor.Server.Models;

namespace ProjetoConversor.Server.Services
{
    public class OfxGenerator
    {
        public string Generate(List<BankTransaction> transactions)
        {
            var ofx = new StringBuilder();

            // Cabeçalho
            ofx.AppendLine("OFXHEADER:100");
            ofx.AppendLine("DATA:OFXSGML");
            ofx.AppendLine("VERSION:102");
            ofx.AppendLine("SECURITY:NONE");
            ofx.AppendLine("ENCODING:UTF-8");
            ofx.AppendLine("CHARSET:UTF-8");
            ofx.AppendLine("COMPRESSION:NONE");
            ofx.AppendLine("OLDFILEUID:NONE");
            ofx.AppendLine("NEWFILEUID:NONE");
            ofx.AppendLine();

            // Estrutura principal
            ofx.AppendLine("<OFX>");
            ofx.AppendLine("<BANKMSGSRSV1>");
            ofx.AppendLine("<STMTTRNRS>");
            ofx.AppendLine("<TRNUID>1");
            ofx.AppendLine("<STATUS>");
            ofx.AppendLine("<CODE>0");
            ofx.AppendLine("<SEVERITY>INFO");
            ofx.AppendLine("</STATUS>");

            ofx.AppendLine("<STMTRS>");
            ofx.AppendLine("<CURDEF>BRL");

            // Dados do banco
            ofx.AppendLine("<BANKACCTFROM>");
            ofx.AppendLine("<BANKID>756");
            ofx.AppendLine("<BRANCHID>3031-7");
            ofx.AppendLine("<ACCTID>130.449-6");
            ofx.AppendLine("<ACCTTYPE>CHECKING");
            ofx.AppendLine("</BANKACCTFROM>");

            // Período
            if (transactions.Count > 0)
            {
                var firstDate = transactions.Min(t => t.Date);
                var lastDate = transactions.Max(t => t.Date);

                ofx.AppendLine("<BANKTRANLIST>");
                ofx.AppendLine($"<DTSTART>{FormatDate(firstDate)}");
                ofx.AppendLine($"<DTEND>{FormatDate(lastDate)}");

                foreach (var transaction in transactions)
                {
                    transaction.FitId = GenerateFitId(transaction);

                    ofx.AppendLine("<STMTTRN>");
                    ofx.AppendLine($"<TRNTYPE>{transaction.Type}");
                    ofx.AppendLine($"<DTPOSTED>{FormatDate(transaction.Date)}");
                    ofx.AppendLine(
                        $"<TRNAMT>{transaction.Amount.ToString("0.00", CultureInfo.InvariantCulture)}"
                    );

                    ofx.AppendLine($"<FITID>{transaction.FitId}");

                    if (!string.IsNullOrWhiteSpace(transaction.CheckNumber))
                    {
                        ofx.AppendLine(
                            $"<CHECKNUM>{transaction.CheckNumber}"
                        );
                    }

                    ofx.AppendLine($"<MEMO>{transaction.Memo}");
                    ofx.AppendLine("</STMTTRN>");
                }

                ofx.AppendLine("</BANKTRANLIST>");
            }

            ofx.AppendLine("</STMTRS>");
            ofx.AppendLine("</STMTTRNRS>");
            ofx.AppendLine("</BANKMSGSRSV1>");
            ofx.AppendLine("</OFX>");

            return ofx.ToString();
        }

        private string FormatDate(DateTime date)
        {
            return date.ToString("yyyyMMddHHmmss") + "[-3:BRT]";
        }

        private string GenerateFitId(BankTransaction transaction)
        {
            var value =
                $"{transaction.Date:yyyyMMdd}" +
                $"{transaction.Amount}" +
                $"{transaction.CheckNumber}" +
                $"{transaction.Memo}";

            return Convert.ToHexString(
                System.Security.Cryptography.SHA256.HashData(
                    Encoding.UTF8.GetBytes(value)
                )
            )[..24];
        }
    }
}