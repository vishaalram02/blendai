from flask import Flask, render_template, request
from functools import wraps
import requests, json, os, zipfile, io
from dotenv import load_dotenv
from base64 import b64encode

app = Flask(__name__, template_folder="../dist", static_folder="../dist/assets")
load_dotenv()
prog = {}

@app.route('/')
def hello():
    return render_template("index.html")

def parse_body(*required_params):      
    def wrapper(f):
        @wraps(f)
        def wrapped(*args, **kwargs):
            body = {}
            body = request.get_json(force=True)
            for param in required_params:
                if param not in body:
                    return f"Error missing {param}", 400

            return f(*args, **kwargs, body=body)
        return wrapped
    return wrapper


@app.route('/processImage', methods=["POST"])
@parse_body("baseImage","maskImage", "prompt", "seed")
def process(body):
    imageData = body["baseImage"]
    mask = body["maskImage"]
    prompt = body["prompt"]
    iterations = body["seed"]

    url = "https://apps.beam.cloud/z2gr1"
    payload = {"mask": mask, "prompt": prompt, "baseImage": imageData, "iterations": iterations}
    headers = {
        "Accept": "*/*",
        "Accept-Encoding": "gzip, deflate",
        "Authorization": os.environ["BEAM_AUTH"],
        "Connection": "keep-alive",
        "Content-Type": "application/json"
    }

    response = requests.request("POST", url, 
        headers=headers,
        data=json.dumps(payload)
    )
    return response.json()


@app.route('/getStatus', methods=["POST"])
@parse_body("task", "seed")
def getstatus(body):
    task = body["task"]
    if task not in prog:
        prog[task] = 0
    prog[task] += (21-int(body["seed"]))//2

    url = "https://api.beam.cloud/v1/task/{TASK_ID}/status/".format(TASK_ID = task)
    headers = {
        "Authorization": os.environ["BEAM_AUTH"],
        "Content-Type": "application/json"
    }   
  
    response = requests.request("GET", url, headers=headers).json()
    if "outputs" in response and response["outputs"]:
        r = requests.get(response["outputs"]["generated_images"]["url"])
        z = zipfile.ZipFile(io.BytesIO(r.content))
        bytes = z.read(sorted(z.namelist())[-int(body["seed"])])

        return {"status": "completed", "bytes": "data:image/png;base64," + b64encode(bytes).decode(), "prog": 100}
    else:
        return {"status": "in progress", "prog": min(prog[task],100)}, 200


if __name__ == "__main__":
    app.run(debug=True, port=3000)