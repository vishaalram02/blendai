from flask import Flask, render_template, request
from functools import wraps
import requests, json, os
from dotenv import load_dotenv

app = Flask(__name__, template_folder="../dist", static_folder="../dist/assets")
load_dotenv()

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
@parse_body("baseImage","maskImage", "prompt")
def process(body):
    imageData = body["baseImage"]
    mask = body["maskImage"]
    prompt = body["prompt"]

    url = "https://apps.beam.cloud/z2gr1"
    payload = {"mask": mask, "prompt": prompt, "baseImage": imageData}
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

    return response



if __name__ == "__main__":
    app.run(debug=True, port=4000)