using System.Globalization;
using System.Text;
using ClosedXML.Excel;
using CsvHelper;
using RsSeguros.Api.Dtos;

namespace RsSeguros.Api.Services;

public class ExportService : IExportService
{
    public byte[] ToCsv(IEnumerable<LeadResponse> leads)
    {
        using var memory = new MemoryStream();
        using var writer = new StreamWriter(memory, new UTF8Encoding(true));
        using var csv = new CsvWriter(writer, CultureInfo.GetCultureInfo("pt-BR"));

        WriteCsvRows(csv, leads);
        writer.Flush();

        return memory.ToArray();
    }

    public byte[] ToXlsx(IEnumerable<LeadResponse> leads)
    {
        using var workbook = new XLWorkbook();
        var sheet = workbook.Worksheets.Add("Leads");
        var headers = Headers();

        for (var i = 0; i < headers.Length; i++)
            sheet.Cell(1, i + 1).Value = headers[i];

        var row = 2;
        foreach (var lead in leads)
        {
            sheet.Cell(row, 1).Value = lead.Nome;
            sheet.Cell(row, 2).Value = lead.Whatsapp;
            sheet.Cell(row, 3).Value = lead.Cidade;
            sheet.Cell(row, 4).Value = lead.Bairro;
            sheet.Cell(row, 5).Value = lead.TipoVeiculo;
            sheet.Cell(row, 6).Value = lead.ModeloVeiculo;
            sheet.Cell(row, 7).Value = lead.AnoVeiculo;
            sheet.Cell(row, 8).Value = lead.PlacaVeiculo;
            sheet.Cell(row, 9).Value = lead.Interesse;
            sheet.Cell(row, 10).Value = lead.Mensagem;
            sheet.Cell(row, 11).Value = lead.Origem;
            sheet.Cell(row, 12).Value = lead.Status;
            sheet.Cell(row, 13).Value = lead.CriadoEm;
            row++;
        }

        sheet.Columns().AdjustToContents();

        using var memory = new MemoryStream();
        workbook.SaveAs(memory);
        return memory.ToArray();
    }

    private static void WriteCsvRows(CsvWriter csv, IEnumerable<LeadResponse> leads)
    {
        foreach (var header in Headers())
            csv.WriteField(header);
        csv.NextRecord();

        foreach (var lead in leads)
        {
            csv.WriteField(lead.Nome);
            csv.WriteField(lead.Whatsapp);
            csv.WriteField(lead.Cidade);
            csv.WriteField(lead.Bairro);
            csv.WriteField(lead.TipoVeiculo);
            csv.WriteField(lead.ModeloVeiculo);
            csv.WriteField(lead.AnoVeiculo);
            csv.WriteField(lead.PlacaVeiculo);
            csv.WriteField(lead.Interesse);
            csv.WriteField(lead.Mensagem);
            csv.WriteField(lead.Origem);
            csv.WriteField(lead.Status);
            csv.WriteField(lead.CriadoEm);
            csv.NextRecord();
        }
    }

    private static string[] Headers()
    {
        return
        [
            "Nome",
            "Whatsapp",
            "Cidade",
            "Bairro",
            "Tipo de Veículo",
            "Modelo",
            "Ano",
            "Placa",
            "Interesse",
            "Mensagem",
            "Origem",
            "Status",
            "Criado em"
        ];
    }
}
