# Malaria Prediction App

This project consists of two main applications:

1. **Python FastAPI Backend** (`predictor/`): Exposes an API for malaria prediction from blood cell images using a Keras model.
2. **React Frontend** (`frontend/`): Modern UI for uploading images and viewing predictions.

---

## 1. Running the Python FastAPI Backend

### Prerequisites
- Python 3.10 or 3.11 (TensorFlow does not support Python 3.13+)
- pip
- (Optional) Docker

### Install dependencies
```
cd predictor
python3.11 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### Run the FastAPI server
```
uvicorn app:app --reload --host 0.0.0.0 --port 8088
```

The API will be available at `http://localhost:8088/predict`.

#### API Usage
- **POST** `/predict`
- Form-data: `file` (image file)
- Returns: `{ "result": "Parasitized" | "Uninfected", "confidence": float }`

---

## 2. Running the Python Backend with Docker

### Prerequisites
- Docker

### Build the Docker image
```
cd predictor
docker build -t malaria-predictor .
```

### Run the Docker container
```
docker run -p 8088:8000 malaria-predictor
```

---

## 3. Running the React Frontend

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### Install dependencies
```
cd frontend
npm install
```

### Start the development server
```
npm run dev
```

The app will be available at `http://localhost:5173` (or as shown in your terminal).

> **Note:**
> - The frontend expects the backend API at `http://localhost:8088/predict` by default. If you deploy the backend elsewhere, update the API URL in `frontend/src/pages/UploadPage.tsx`.

---

## 4. Project Structure

```
malaria-app/
├── predictor/         # Python FastAPI backend
│   ├── app.py
│   ├── Dockerfile
│   ├── malaria_classifier.keras
│   ├── predict.py
│   ├── requirements.txt
│   └── ...
├── frontend/          # React + Tailwind frontend (Vite + TypeScript)
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.cjs
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── src/
│       ├── App.tsx
│       ├── main.css
│       ├── main.tsx
│       └── pages/
│           └── UploadPage.tsx
└── README.md
```

---

## 5. Troubleshooting
- Ensure the backend is running before uploading images from the frontend.
- If using Docker, make sure port 8088 is not blocked.
- For CORS issues, the backend is configured to allow all origins by default.
- If you see errors about TensorFlow or python-multipart, ensure your Python version is supported and all requirements are installed.
- If you get a shape mismatch error, check your model's expected input shape and adjust the image preprocessing in `app.py` if needed.

---

## 6. Deployment
- The React app can be deployed to Cloudflare Pages or any static hosting.
- The Python backend can be deployed using Docker to any cloud provider or VM.

---

# Research & Attribution

This project was developed as part of a research dissertation:

- **Title:** Design and Implementation of a Convolutional Neural Network for Malaria Diagnosis: Image-Based Classification of Uninfected and Infected Blood Cells
- **Author:** Lawrence Ifeanyi Eze
- **Degree:** Master of Science
- **Institution:** University of East London
- **Year:** 2025
- **Model Source Code:** https://github.com/ifeanyilawrence/malaria-classifier

---

For further questions, please refer to the code comments or open an issue.
