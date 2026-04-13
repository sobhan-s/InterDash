import React, { useState, useEffect, useCallback } from 'react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { faker } from '@faker-js/faker';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import JSZip from 'jszip';
import CryptoJS from 'crypto-js';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Download, FileSpreadsheet, FileText, Archive, Lock } from 'lucide-react';
import type { FakeReportRecord, ReportGeneratorProps } from '@/lib/types';

const ReportGeneratorComponent = ({ posts, users,  theme }: ReportGeneratorProps) => {
  const [generating, setGenerating] = useState(false);
  const [fakeData, setFakeData] = useState<FakeReportRecord[]>([]);
  const [encryptedData, setEncryptedData] = useState('');

  useEffect(() => {
    const data = Array.from({ length: 1000 }, () => ({
      id: faker.string.uuid(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      company: faker.company.name(),
      department: faker.commerce.department(),
      jobTitle: faker.person.jobTitle(),
      salary: faker.number.int({ min: 30000, max: 200000 }),
      startDate: faker.date.past().toISOString(),
      address: faker.location.streetAddress(),
      city: faker.location.city(),
      country: faker.location.country(),
      bio: faker.lorem.paragraph(),
    }));

    setFakeData(data);

    const encrypted = CryptoJS.AES.encrypt(
      JSON.stringify(data.slice(0, 100)),
      'secret-key-123',
    ).toString();

    setEncryptedData(encrypted);
  }, []);

  

  const generatePDF = useCallback(async () => {
    setGenerating(true);
    try {
      const pdfDoc = await PDFDocument.create();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      const titlePage = pdfDoc.addPage([595, 842]);
      titlePage.drawText('InternDash Report', {
        x: 50,
        y: 750,
        size: 30,
        font: boldFont,
        color: rgb(0, 0, 0),
      });

      titlePage.drawText(`Generated: ${new Date().toISOString()}`, {
        x: 50,
        y: 710,
        size: 12,
        font,
        color: rgb(0.5, 0.5, 0.5),
      });

      titlePage.drawText(`Total Records: ${fakeData.length}`, {
        x: 50,
        y: 690,
        size: 12,
        font,
        color: rgb(0.5, 0.5, 0.5),
      });

      for (let i = 0; i < Math.min(fakeData.length, 50); i++) {
        if (i % 20 === 0) {
          const page = pdfDoc.addPage([595, 842]);
          page.drawText(`Records ${i + 1} - ${Math.min(i + 20, 50)}`, {
            x: 50,
            y: 800,
            size: 14,
            font: boldFont,
          });
        }

        const page = pdfDoc.getPages()[Math.floor(i / 20) + 1];
        const y = 770 - (i % 20) * 35;

        page.drawText(`${fakeData[i].firstName} ${fakeData[i].lastName}`, {
          x: 50,
          y,
          size: 10,
          font: boldFont,
        });

        page.drawText(`${fakeData[i].email} | ${fakeData[i].company}`, {
          x: 50,
          y: y - 12,
          size: 8,
          font,
          color: rgb(0.4, 0.4, 0.4),
        });

        page.drawText(`${fakeData[i].jobTitle} - $${fakeData[i].salary.toLocaleString()}`, {
          x: 50,
          y: y - 22,
          size: 8,
          font,
          color: rgb(0.6, 0.6, 0.6),
        });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      saveAs(blob, 'interndash-report.pdf');
    } catch (e) {}
    setGenerating(false);
  }, [fakeData]);

  const generateExcel = useCallback(() => {
    const wsData = fakeData.slice(0, 1000).map((d) => ({
      Name: `${d.firstName} ${d.lastName}`,
      Email: d.email,
      Phone: d.phone,
      Company: d.company,
      Department: d.department,
      'Job Title': d.jobTitle,
      Salary: d.salary,
      City: d.city,
      Country: d.country,
    }));

    const ws = XLSX.utils.json_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Report');
    XLSX.writeFile(wb, 'interndash-report.xlsx');
  }, [fakeData]);

  const generateCSV = useCallback(() => {
    const csv = Papa.unparse(fakeData.slice(0, 1000));
    const blob = new Blob([csv], { type: 'text/csv' });
    saveAs(blob, 'interndash-report.csv');
  }, [fakeData]);

  const generateZip = useCallback(async () => {
    const zip = new JSZip();

    const csv = Papa.unparse(fakeData.slice(0, 500));
    zip.file('data.csv', csv);

    zip.file(
      'metadata.json',
      JSON.stringify({
        generated: new Date().toISOString(),
        count: fakeData.length,
      }),
    );

    zip.file('encrypted.txt', encryptedData);

    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, 'interndash-bundle.zip');
  }, [fakeData, encryptedData]);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Download className="h-4 w-4" />
          Report Generator
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <Badge variant="outline">{fakeData.length} records</Badge>
          <Badge variant="secondary">
            <Lock className="h-3 w-3 mr-1" />
            Encrypted: {encryptedData.length} chars
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            onClick={generatePDF}
            disabled={generating}
            className="justify-start"
          >
            <FileText className="h-4 w-4 mr-2" />
            {generating ? 'Generating...' : 'Export PDF'}
          </Button>

          <Button variant="outline" onClick={generateExcel} className="justify-start">
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Export Excel
          </Button>

          <Button variant="outline" onClick={generateCSV} className="justify-start">
            <FileText className="h-4 w-4 mr-2" />
            Export CSV
          </Button>

          <Button variant="outline" onClick={generateZip} className="justify-start">
            <Archive className="h-4 w-4 mr-2" />
            Export ZIP Bundle
          </Button>
        </div>

        <div className="mt-3 max-h-[200px] overflow-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="p-1.5 text-left">Name</th>
                <th className="p-1.5 text-left">Email</th>
                <th className="p-1.5 text-left">Company</th>
                <th className="p-1.5 text-right">Salary</th>
              </tr>
            </thead>

            <tbody>
              {fakeData.slice(0, 50).map((d, i) => (
                <tr key={i} className="border-b">
                  <td className="p-1.5">
                    {d.firstName} {d.lastName}
                  </td>
                  <td className="p-1.5 text-muted-foreground">{d.email}</td>
                  <td className="p-1.5">{d.company}</td>
                  <td className="p-1.5 text-right font-mono">${d.salary.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default React.memo(ReportGeneratorComponent);
