import os
import re

file_path = r'c:\Users\88016\OneDrive\Desktop\PROJECTS\EternoFit HEALTH QUIZ\src\EmailMarketingAdmin.jsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("random 5-20 second delay", "random 10-20 second delay")
content = content.replace("Interval delay: 5-20 seconds", "Interval delay: 10-20 seconds")
content = content.replace("Approx. 5-20s", "Approx. 10-20s")
content = content.replace("between 5 and 20 seconds", "between 10 and 20 seconds")
content = content.replace("Math.floor(Math.random() * (20 - 5 + 1) + 5)", "Math.floor(Math.random() * (20 - 10 + 1) + 10)")

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated 5-20s to 10-20s")
