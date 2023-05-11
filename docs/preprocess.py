# Requires: pandas and openpyxl
import pandas as pd

pd.read_excel("https://www.ema.europa.eu/sites/default/files/Medicines_output_european_public_assessment_reports.xlsx").to_csv("medecines.csv")