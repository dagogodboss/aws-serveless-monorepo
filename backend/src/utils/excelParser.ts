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

  const headerRow = rows[0];
  const dataRows = rows.slice(1);

  const result: RowData[] = dataRows.map((row: { [x: string]: any; }) => {
    const rowData: RowData = {};
    headerRow.forEach((header: string | number, index: string | number) => {
      rowData[header] = row[index];
    });
    return rowData;
  });

  return result;
}

export { readExcelFile };
