FROM python:3.13-slim

WORKDIR /app

# Copy requirements and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY . .

# Expose port
EXPOSE 8003

# Command to run uvicorn on port $PORT (Render provides this)
CMD uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8003}
