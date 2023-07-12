import beam

app = beam.App(
    name="blendai",
    cpu=8,
    memory="32Gi",
    gpu="A10G",
    python_version="python3.9",
    python_packages=["ftfy", "regex", "matplotlib", "lpips", "kornia", "opencv-python-headless", "torch", "torchvision"],
)
app.Mount.PersistentVolume(name="model_weights", path="./checkpoints")
app.Output.Dir(path="output", name="generated_images")


app.Trigger.TaskQueue(
    inputs = {"baseImage": beam.Types.Image(raw=False), "mask": beam.Types.Image(), "prompt": beam.Types.String()},
    handler = "main.py:generate_image"
)