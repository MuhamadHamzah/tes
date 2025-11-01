import QRCode from 'qrcode';

export interface AttendanceEvent {
  id: string;
  event_name: string;
  event_date: string;
  event_type: string;
  qr_code_senior: string;
  qr_code_umum: string;
  qr_code_panitia: string;
  spreadsheet_url_senior: string | null;
  spreadsheet_url_umum: string | null;
  spreadsheet_url_panitia: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type AttendanceType = 'senior' | 'umum' | 'panitia';

export interface SeniorAttendance {
  nama: string;
  angkatan: number;
  waktu_checkin: string;
}

export interface UmumAttendance {
  nama: string;
  prodi: string;
  nomor_hp: string;
  waktu_checkin: string;
}

export interface PanitiaAttendance {
  nama: string;
  npm: string;
  angkatan: number;
  waktu_checkin: string;
}

export async function generateQRCode(data: string): Promise<string> {
  try {
    const qrCodeDataUrl = await QRCode.toDataURL(data, {
      width: 400,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    });
    return qrCodeDataUrl;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw error;
  }
}

export function generateAttendanceUrl(
  eventId: string,
  type: AttendanceType
): string {
  const baseUrl = window.location.origin;
  return `${baseUrl}/attendance/${type}/${eventId}`;
}

export async function submitToGoogleSheets(
  spreadsheetUrl: string,
  data: Record<string, any>
): Promise<boolean> {
  try {
    const match = spreadsheetUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (!match) {
      throw new Error('Invalid Google Sheets URL');
    }

    const spreadsheetId = match[1];
    const scriptUrl = `https://script.google.com/macros/s/${spreadsheetId}/exec`;

    const response = await fetch(scriptUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    return true;
  } catch (error) {
    console.error('Error submitting to Google Sheets:', error);
    return false;
  }
}
