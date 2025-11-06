import * as htmlToImage from 'html-to-image';
import { WorkBook, utils } from 'xlsx';

export async function captureChartAsImage(element: HTMLElement): Promise<Uint8Array | null> {
  try {
    const dataUrl = await htmlToImage.toPng(element);
    const binaryString = atob(dataUrl.split(',')[1]);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  } catch (error) {
    console.error('Error capturing chart:', error);
    return null;
  }
}

export function addImageToWorkbook(workbook: WorkBook, sheetName: string, imageData: Uint8Array, position: string = 'A1') {
  const sheet = workbook.Sheets[sheetName];
  if (sheet && imageData) {
    const imageId = workbook.SheetNames.length;
    const imageType = 'image/png';

    // Add the image to the workbook (extending the WorkBook type)
    const wb = workbook as any;
    if (!wb.Images) wb.Images = {};
    wb.Images[imageId] = {
      data: imageData,
      type: imageType,
    };

    // Add the image reference to the sheet
    const ws = sheet as any;
    ws['!images'] = ws['!images'] || [];
    ws['!images'].push({
      name: `image${imageId}`,
      type: imageType,
      position: position,
      data: imageData,
    });
  }
}