from ultralytics import YOLO

# if __name__ == "__main__":
# Load a model
model = YOLO("yolov8n-cls.pt")  # load a pretrained model (recommended for training)

# Train the model with MPS
results = model.train(data="Dataset", epochs=20,device="cpu") 