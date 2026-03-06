import sys
import json
import torch
import timm
import cv2
import numpy as np
from PIL import Image
import torchvision.transforms as transforms

# Load pretrained model
model = timm.create_model("resnet18", pretrained=True)
model.eval()

transform = transforms.Compose([
    transforms.Resize((224,224)),
    transforms.ToTensor()
])

def analyze_image(path):

    try:
        img = Image.open(path).convert("RGB")
        input_tensor = transform(img).unsqueeze(0)

        with torch.no_grad():
            output = model(input_tensor)

        probs = torch.softmax(output, dim=1)

        fake_probability = float(probs.max())

        authenticity_score = (1 - fake_probability) * 100

        return {
            "score": authenticity_score,
            "confidence": fake_probability,
            "type": "image"
        }

    except Exception as e:
        return {
            "score":50,
            "confidence":0.5,
            "error":str(e)
        }


def analyze_video(path):

    cap = cv2.VideoCapture(path)

    scores = []

    frame_count = 0

    while True:

        ret, frame = cap.read()

        if not ret:
            break

        frame_count += 1

        if frame_count % 15 == 0:

            frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            img = Image.fromarray(frame)

            input_tensor = transform(img).unsqueeze(0)

            with torch.no_grad():
                output = model(input_tensor)

            probs = torch.softmax(output, dim=1)

            scores.append(float(probs.max()))

    cap.release()

    if len(scores) == 0:
        return {"score":50,"confidence":0.5}

    avg_fake = np.mean(scores)

    authenticity_score = (1 - avg_fake) * 100

    return {
        "score": authenticity_score,
        "confidence": avg_fake,
        "framesAnalyzed": len(scores),
        "type": "video"
    }


if __name__ == "__main__":

    file_path = sys.argv[1]

    if file_path.endswith((".mp4",".avi",".mov",".mkv")):
        result = analyze_video(file_path)
    else:
        result = analyze_image(file_path)

    print(json.dumps(result))