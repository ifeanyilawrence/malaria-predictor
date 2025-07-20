from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
import numpy as np
from tensorflow.keras.models import load_model
from PIL import Image
import io
import traceback

app = FastAPI()

# Allow CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = load_model("malaria_classifier.keras")
print("Loaded model input shape:", model.input_shape)

# Dynamically set image size from model input shape
if len(model.input_shape) == 2:
    # (batch, features)
    IMG_SIZE = None
    FLATTEN = True
    FLAT_SIZE = model.input_shape[1]
elif len(model.input_shape) == 4:
    # (batch, height, width, channels)
    _, h, w, c = model.input_shape
    IMG_SIZE = (h, w)
    CHANNELS = c
    FLATTEN = False
else:
    raise ValueError(f"Unsupported model input shape: {model.input_shape}")

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")
        if IMG_SIZE:
            image = image.resize(IMG_SIZE)
        img_array = np.array(image) / 255.0
        if not FLATTEN:
            img_array = np.expand_dims(img_array, axis=0)
        else:
            img_array = img_array.flatten().reshape(1, -1)
        prediction = model.predict(img_array)
        # Assuming binary classification: 0 = Parasitized, 1 = Uninfected
        pred_class = int(prediction[0][0] > 0.5)
        result = "Uninfected" if pred_class == 1 else "Parasitized"
        confidence = float(prediction[0][0]) if pred_class == 1 else 1 - float(prediction[0][0])
        return {"result": result, "confidence": confidence}
    except Exception as e:
        print("Exception in /predict endpoint:", e)
        traceback.print_exc()
        return JSONResponse(status_code=500, content={"error": str(e)})

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
