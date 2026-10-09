import { describe, expect, it } from "vitest";
import { buildCsv, escapeCsvCell } from "./exportToCsv";

describe("escapeCsvCell", () => {
  it("quotes commas, quotes and line breaks", () => {
    expect(escapeCsvCell("a,b")).toBe('"a,b"');
    expect(escapeCsvCell('say "hi"')).toBe('"say ""hi"""');
    expect(escapeCsvCell("line1\nline2")).toBe('"line1\nline2"');
  });

  it("turns null and undefined into empty cells", () => {
    expect(escapeCsvCell(null)).toBe("");
    expect(escapeCsvCell(undefined)).toBe("");
  });

  it("neutralizes spreadsheet formulas typed by users", () => {
    expect(escapeCsvCell("=SUM(A1:A9)")).toBe("'=SUM(A1:A9)");
    expect(escapeCsvCell("@cmd")).toBe("'@cmd");
    expect(escapeCsvCell("+1+1")).toBe("'+1+1");
    expect(escapeCsvCell("-2+3")).toBe("'-2+3");
    expect(escapeCsvCell('=HYPERLINK("http://x","y")')).toBe('"\'=HYPERLINK(""http://x"",""y"")"');
  });

  it("leaves real numbers, phone numbers and a lone dash alone", () => {
    expect(escapeCsvCell(-5)).toBe("-5");
    expect(escapeCsvCell("+989121112233")).toBe("+989121112233");
    expect(escapeCsvCell("-")).toBe("-");
    expect(escapeCsvCell("گوشی")).toBe("گوشی");
  });
});

describe("buildCsv", () => {
  it("builds a header row and data rows joined by CRLF", () => {
    const csv = buildCsv(
      [{ name: "iPhone", price: 10 }, { name: "=bad", price: 20 }],
      [
        { header: "name", accessor: (r) => r.name },
        { header: "price", accessor: (r) => r.price },
      ],
    );
    expect(csv).toBe("name,price\r\niPhone,10\r\n'=bad,20");
  });
});
