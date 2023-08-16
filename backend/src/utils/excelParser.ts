/** @format */

import * as XLSX from "xlsx";

interface RowData {
  [key: string]: any;
}

function readExcelFile(file: any): RowData[] {
  const workbook = XLSX.read(file.data, { type: "buffer" });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1, raw: false });

  const headerRow = rows[0] as string[];
  const dataRows = rows.slice(1);

  const result: RowData[] = dataRows.map((row: unknown) => {
    const rowData: RowData = {};
    headerRow.forEach((header: string, index: number) => {
      rowData[header] = (row as (string | number)[])[index];
    });
    return rowData;
  });

  return result;
}

export { readExcelFile };
