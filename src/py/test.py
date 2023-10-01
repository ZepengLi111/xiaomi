import csv
from datetime import datetime
from datetime import timedelta

f = open("午夜食堂.csv", newline='', encoding='utf-8')
f2 = open("o.csv", 'w', newline='', encoding='utf-8')
reader = csv.reader(f)
writer = csv.writer(f2)

time = ""
count = 0

for i in reader:
    if i[0] == "TIME":
        time = i[1].replace('年', '-').replace('月', '-').replace('日', '').replace('号', '')
        time = datetime.strptime(time, '%Y-%m-%d %H:%M')
        count = 0
    if i != "":
        i.append(time)
        if count == 10:
            time += timedelta(seconds=1)
            count = 0
        count += 1
    writer.writerow(i)


