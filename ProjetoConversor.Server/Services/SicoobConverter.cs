using UglyToad.PdfPig;
using System.Text;

namespace ProjetoConversor.Server.Services
{
    public class SicoobConverter
    {
        public string ExtractText(Stream pdfStream)
        {
            var text = new StringBuilder();

            using var document = PdfDocument.Open(pdfStream);

            foreach (var page in document.GetPages())
            {
                text.AppendLine(page.Text);
            }

            return text.ToString();
        }
    }
}