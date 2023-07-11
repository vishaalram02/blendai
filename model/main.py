from optimization.image_editor import ImageEditor
from optimization.arguments import get_arguments
import base64
from argparse import Namespace

def process(image):
    return image.replace('data:image/jpeg;base64,', '').replace('data:image/png;base64,', '').replace('data:image/webm;base64,', '')


def generate_image(**inputs):
    baseImage = inputs["baseImage"]
    mask = inputs["mask"]
    prompt = inputs["prompt"]
    baseImage.convert("RGB").save("input.jpg")
    mask.convert("RGB").save("mask.jpg")
    
    args = {
        "init_image": "input.jpg",
        "mask": "mask.jpg",
        "prompt": prompt,
        "output_path": "output",
        "output_file": "output.png",
        "skip_timesteps": 25,
        "timestep_respacing": "100",
        "model_output_size": 256,
        "aug_num": 8,
        "clip_guidance_lambda": 1000,
        "range_lambda": 50,
        "lpips_sim_lambda": 1000,
        "l2_sim_lambda": 10000,
        "seed": 404,
        "gpu_id": 0,
        "iterations_num": 8,
        "batch_size": 1,
        "export_assets": None,
        "background_preservation_loss": None,
        "invert_mask": None,
        "save_video": None,
        "enforce_background": None,
        "ddim": None,
        "local_clip_guided_diffusion": None,
    }
    image_editor = ImageEditor(Namespace(**args))
    image_editor.edit_image_by_prompt()