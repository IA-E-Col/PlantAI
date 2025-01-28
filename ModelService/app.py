import os

from pydantic import BaseModel
import torch
from torchvision import transforms
from ultralytics import YOLO
from fastapi import FastAPI, HTTPException, Body, UploadFile, File
import requests
from PIL import Image
from io import BytesIO
import numpy as np

class ImageRequest(BaseModel):
    image_path: str
    urlmodel:str


app = FastAPI()
UPLOAD_DIR = "models/"
""" 
path_base = 'Lisse_Dente.pt'
model = YOLO(model_path)
model_path2 = './Absence_presence.pt'
model2 = YOLO(model_path2)

@app.post("/predict/")
async def get_prediction(request: ImageRequest):
    image_path = request.image_path
    print(image_path)
    try:
        response = requests.get(image_path)
        response.raise_for_status()
        img = Image.open(BytesIO(response.content)).convert("RGB")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load image from URL: {e}")
    results = model(img)
    probs=results[0].probs.data.tolist()
    prediction = np.argmax(probs)

    if prediction.item():
        return {
            "libelle": "Lisse/Dente",
            "mode": "Inference",
            "etat": 0,
            "predictionValue":  1,
            "predictionClasse": "Lisse"
        }
    else:
        return {
            "libelle": "Lisse/Dente",
            "mode": "Inference",
            "etat": 0,
            "predictionValue":  "0",
            "predictionClasse": "Dente"
        }

@app.post("/predict2/")
async def get_prediction(request: ImageRequest):
    print("I am in present or absent")
    image_path = request.image_path
    print(image_path)
    try:
        response = requests.get(image_path)
        response.raise_for_status()
        img = Image.open(BytesIO(response.content)).convert("RGB")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load image from URL: {e}")

    # Ensure the image is transformed to a format suitable for the model
    transform = transforms.Compose([
        transforms.Resize((224, 224)),  # Resize to the size expected by the model
        transforms.ToTensor(),          # Convert the image to a PyTorch tensor
    ])
    img_tensor = transform(img).unsqueeze(0)  # Add batch dimension

    # Perform inference
    try:
        with torch.no_grad():
            results = model2(img_tensor)
        probs = results[0].probs.data.tolist()
        print(probs)
        prediction = np.argmax(probs)
        print(prediction.item(),"hhhhh")
        if prediction.item():
            return {
                "libelle": "Present/Absent",
                "mode": "Inference",
                "etat": 0,
                "predictionValue": 1,
                "predictionClasse": "absent"
            }
        else:
            return {
                "libelle": "Present/Absent",
                "mode": "Inference",
                "etat": 0,
                "predictionValue": 0,
                "predictionClasse": "Present"
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to make prediction: {e}")

*/
"""

@app.post("/predictAll/")
async def get_prediction(request: ImageRequest):
    print(1)
    image_path = request.image_path
    modele = request.urlmodel
    print(image_path)
    print(2)
    try:
        response = requests.get(image_path)
        print(3)
        response.raise_for_status()
        print(4)
        img = Image.open(BytesIO(response.content)).convert("RGB")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load image from URL: {e}")
    model_path = './'+modele+'.pt'
    model = YOLO(model_path)
    print(5)
    print(model_path)
    # Transform the image
    transform = transforms.Compose([
        transforms.Resize((224, 224)),  # Resize to the size expected by the model
        transforms.ToTensor(),          # Convert the image to a PyTorch tensor
    ])
    print(6)
    img_tensor = transform(img).unsqueeze(0)  # Add batch dimension
    # Perform inference
    try:
        with torch.no_grad():

            results = model(img_tensor)

        probs = results[0].probs.data.tolist()

        prediction = int(np.argmax(probs))
        max_probability = float(probs[prediction])
        return {
            "predictionValue": prediction,
            "precision":max_probability
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to make prediction: {e}")
