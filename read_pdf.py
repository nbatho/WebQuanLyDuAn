import os
import glob
import subprocess
import sys

def ensure_pypdf2():
    try:
        import PyPDF2
    except ImportError:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "PyPDF2"])
        import PyPDF2

ensure_pypdf2()
import PyPDF2

pdfs = glob.glob('*.pdf')
if not pdfs:
    print("No PDF files found in this directory.")
else:
    pdf_path = pdfs[0]
    try:
        with open(pdf_path, 'rb') as f:
            reader = PyPDF2.PdfReader(f)
            num_pages = len(reader.pages)
            with open("out_pdf.txt", "w", encoding="utf-8") as out:
                out.write(f"Total pages: {num_pages}\n\n")
                for i in range(min(15, num_pages)):
                    out.write(f"--- Page {i+1} ---\n")
                    out.write(reader.pages[i].extract_text() + "\n\n")
            print("Successfully extracted text to out_pdf.txt")
    except Exception as e:
        print(f"Error reading PDF: {e}")
