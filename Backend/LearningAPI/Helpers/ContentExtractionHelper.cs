using iTextSharp.text.pdf.parser;
using iTextSharp.text.pdf;
using System.Text;
using DocumentFormat.OpenXml.Packaging;

namespace LearningAPI.Helpers
{
    public static class ContentExtractionHelper
    {
        public static string ExtractTextFromPdf(Stream stream)
        {
            var extractedText = new StringBuilder();
            using (PdfReader pdfReader = new PdfReader(stream))
            {
                for (int i = 1; i <= pdfReader.NumberOfPages; i++)
                {
                    extractedText.Append(PdfTextExtractor.GetTextFromPage(pdfReader, i));
                }
            }
            return extractedText.ToString();
        }

        public static string ExtractTextFromDocx(Stream stream)
        {
            var extractedText = new StringBuilder();

            using (WordprocessingDocument wordDoc = WordprocessingDocument.Open(stream, false))
            {
                var body = wordDoc.MainDocumentPart.Document.Body;
                foreach (var text in body.Descendants<DocumentFormat.OpenXml.Wordprocessing.Text>())
                {
                    extractedText.Append(text.Text);
                }
            }

            return extractedText.ToString();
        }
    }
}
