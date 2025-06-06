let storedData = [];
let storedColumns = [];

export function setExportData(data, columns) {
  storedData = data;
  storedColumns = columns;
}

export function getExportData() {
  return {
    data: storedData,
    columns: storedColumns,
  };
}

