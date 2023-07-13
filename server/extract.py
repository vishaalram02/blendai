import requests, zipfile, io, base64

url = "https://api.beam.cloud/v1/task/{TASK_ID}/status/".format(TASK_ID = "55eb9762-fe2f-4963-b249-5a64e06b6885")
headers = {
    "Authorization": "Basic OGIwNDM3NzdkNDk1MDk0ZWU3OTA0NWU1ODc1YzE0Mjg6OTZiYzkwMGM2NGYwN2YxMzcyZjcwYWU1ZGNhMGRlNjI=",
    "Content-Type": "application/json"
}   

response = requests.request("GET", url, headers=headers).json()
r = requests.get(response["outputs"]["generated_images"]["url"])
z = zipfile.ZipFile(io.BytesIO(r.content))
bytes = z.read(sorted(z.namelist())[-8])
print(base64.b64encode(bytes).encode("utf-8"))
