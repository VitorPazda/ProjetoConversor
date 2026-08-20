using System.Globalization;
using System.Text;
using ProjetoConversor.Server.Models;

namespace ProjetoConversor.Server.Services
{
    public class OfxGenerator
    {
        public string Generate(BankStatement statement)
        {
            var ofx = new StringBuilder();

            ofx.AppendLine("OFXHEADER:100");
            ofx.AppendLine("DATA:OFXSGML");
            ofx.AppendLine("VERSION:102");
            ofx.AppendLine("SECURITY:NONE");
            ofx.AppendLine("ENCODING:USASCII");
            ofx.AppendLine("CHARSET:1252");
            ofx.AppendLine("COMPRESSION:NONE");
            ofx.AppendLine("OLDFILEUID:NONE");
            ofx.AppendLine("NEWFILEUID:NONE");
            ofx.AppendLine();

            ofx.AppendLine("<OFX>");

            // Signon
            ofx.AppendLine("<SIGNONMSGSRSV1>");
            ofx.AppendLine("<SONRS>");

            ofx.AppendLine("<STATUS>");
            ofx.AppendLine("<CODE>0</CODE>");
            ofx.AppendLine("<SEVERITY>INFO</SEVERITY>");
            ofx.AppendLine("</STATUS>");

            ofx.AppendLine($"<DTSERVER>{FormatDate(statement.EndDate)}</DTSERVER>");

            ofx.AppendLine("<LANGUAGE>POR</LANGUAGE>");

            ofx.AppendLine("<FI>");

            ofx.AppendLine($"<ORG>{statement.BankName}</ORG>");

            ofx.AppendLine($"<FID>{statement.BankId}</FID>");

            ofx.AppendLine("</FI>");

            ofx.AppendLine("</SONRS>");
            ofx.AppendLine("</SIGNONMSGSRSV1>");

            // Bank
            ofx.AppendLine("<BANKMSGSRSV1>");
            ofx.AppendLine("<STMTTRNRS>");

            ofx.AppendLine("<TRNUID>1</TRNUID>");

            ofx.AppendLine("<STATUS>");
            ofx.AppendLine("<CODE>0</CODE>");
            ofx.AppendLine("<SEVERITY>INFO</SEVERITY>");
            ofx.AppendLine("</STATUS>");

            ofx.AppendLine("<STMTRS>");
            ofx.AppendLine("<CURDEF>BRL</CURDEF>");

            // Account
            ofx.AppendLine("<BANKACCTFROM>");

            ofx.AppendLine($"<BANKID>{statement.BankId}</BANKID>");

            ofx.AppendLine($"<BRANCHID>{statement.BranchId}</BRANCHID>");

            ofx.AppendLine($"<ACCTID>{statement.AccountId}</ACCTID>");

            ofx.AppendLine("<ACCTTYPE>CHECKING</ACCTTYPE>");

            ofx.AppendLine("</BANKACCTFROM>");

            // Transactions
            ofx.AppendLine("<BANKTRANLIST>");

            ofx.AppendLine( $"<DTSTART>{FormatDate(statement.StartDate)}</DTSTART>");

            ofx.AppendLine($"<DTEND>{FormatDate(statement.EndDate)}</DTEND>");

            var transactionNumberByDate = new Dictionary<string, int>();

            foreach(var transaction in statement.Transactions)
            {
                var dateKey =transaction.Date.ToString("yyyyMMdd");

                if (!transactionNumberByDate.ContainsKey(dateKey))
                {
                    transactionNumberByDate[dateKey] = 0;
                }

                transactionNumberByDate[dateKey]++;

                var sequence = transactionNumberByDate[dateKey];

                var fitId = $"{dateKey}{sequence:D2}";

                transaction.FitId = fitId;

                ofx.AppendLine("<STMTTRN>");

                ofx.AppendLine($"<TRNTYPE>{transaction.Type}</TRNTYPE>");

                ofx.AppendLine($"<DTPOSTED>{FormatDate(transaction.Date)}</DTPOSTED>");

                ofx.AppendLine($"<TRNAMT>{transaction.Amount.ToString("0.00",CultureInfo.InvariantCulture)}</TRNAMT>");

                ofx.AppendLine($"<FITID>{fitId}</FITID>");

                ofx.AppendLine($"<CHECKNUM>{fitId}</CHECKNUM>");

                ofx.AppendLine($"<MEMO>{Escape(transaction.Memo)}</MEMO>");

                ofx.AppendLine("</STMTTRN>");
            }

            ofx.AppendLine("</BANKTRANLIST>");

            // Balancae
            ofx.AppendLine("<LEDGERBAL>");

            ofx.AppendLine($"<BALAMT>{statement.Balance.ToString("0.00",CultureInfo.InvariantCulture)}</BALAMT>");

            ofx.AppendLine($"<DTASOF>{statement.EndDate:yyyyMMdd}</DTASOF>");

            ofx.AppendLine("</LEDGERBAL>");

            ofx.AppendLine("</STMTRS>");
            ofx.AppendLine("</STMTTRNRS>");
            ofx.AppendLine("</BANKMSGSRSV1>");

            ofx.AppendLine("</OFX>");

            return ofx.ToString();
        }

        private string FormatDate(DateTime date)
        {
            return date.ToString("yyyyMMdd235959");
        }

        private string Escape(string text)
        {
            return text
                .Replace("&", "&amp;")
                .Replace("<", "&lt;")
                .Replace(">", "&gt;");
        }
    }
}