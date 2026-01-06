import * as XLSX from 'xlsx-js-style';

export interface XlsxParseOptions {
    sheetName?: string;     // Имя листа (если не указано — возьмём первый)
    headerRow?: number;     // Номер строки с заголовками (1-based). По умолчанию — первая строка
}

export interface XlsxParseResult<T = any> {
    sheetName: string;
    rows: T[];              // Каждая строка — объект { Колонка: Значение }
}

export class XlsxHelper {
    static parse<T = any>(buffer: Buffer, options?: XlsxParseOptions): XlsxParseResult<T> {
        if (!buffer || buffer.length === 0) {
            throw new Error('XLSX buffer is empty');
        }

        const workbook = XLSX.read(buffer, {type: 'buffer'});
        const sheetName = options?.sheetName ?? workbook.SheetNames?.[0];

        if (!sheetName) {
            throw new Error('Workbook does not contain any sheets');
        }

        const worksheet = workbook.Sheets[sheetName];
        if (!worksheet) {
            throw new Error(`Sheet "${sheetName}" was not found`);
        }

        // Если нужно сместить заголовок на другую строку, используем range
        let range: string | undefined = undefined;
        if (options?.headerRow && options.headerRow > 1 && worksheet['!ref']) {
            const decoded = XLSX.utils.decode_range(worksheet['!ref']);
            decoded.s.r = options.headerRow - 1; // 0-based
            range = XLSX.utils.encode_range(decoded);
        }

        const rows = XLSX.utils.sheet_to_json<T>(worksheet, {
            defval: null,   // пустые ячейки -> null
            raw:    true,      // не форматируем значения
            range,          // ограничиваем диапазон, если задан headerRow
        });

        return {sheetName, rows};
    }

    static create(data: Record<string, string | number>[], sheetName = 'Отчет') {
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(data);
        XLSX.utils.book_append_sheet(wb, ws, sheetName);
        return XLSX.write(wb, {type: 'buffer', bookType: 'xlsx'});
    }

    static calculateRowHeight(text: string, columnWidth: number, lineHeightPx: number = 20): number {
        if (!text) {
            return lineHeightPx;
        }

        const avgCharWidth = 0.65;
        const maxCharsPerLine = Math.floor(columnWidth / avgCharWidth);
        if (text.length <= maxCharsPerLine) {
            return lineHeightPx;
        }

        let currentLineLength = 0;
        let lineCount = 0;

        text.split('\n').forEach(line => {
            const words = line.split(' ');
            for (const word of words) {
                if (currentLineLength + word.length + 1 > maxCharsPerLine) {
                    lineCount++;
                    currentLineLength = word.length;
                    continue;
                }

                currentLineLength += word.length + 1;
            }
            lineCount++;
            currentLineLength = 0;
        });

        return lineCount * lineHeightPx;
    }
}
