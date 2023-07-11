import beam

app = beam.App(
    name="blendai",
    cpu=16,
    memory="64Gi",
    gpu="T4",
    python_version="python3.9",
    python_packages=["ftfy", "regex", "matplotlib", "lpips", "kornia", "opencv-python-headless", "torch==1.9.0", "torchvision==0.10.0"],
)
app.Mount.PersistentVolume(name="model_weights", path="./checkpoints")
app.Output.Dir(path="output", name="generated_images")


app.Trigger.TaskQueue(
    inputs = {"baseImage": beam.Types.Image(raw=False), "mask": beam.Types.Image(), "prompt": beam.Types.String()},
    handler = "main.py:generate_image"
)