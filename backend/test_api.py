import urllib.request
import json

try:
    req = urllib.request.urlopen("http://127.0.0.1:8003/api/experiences/1")
    print(req.read().decode())
except Exception as e:
    print(f"Error for experiences: {e}")

try:
    req = urllib.request.urlopen("http://127.0.0.1:8003/api/listings?limit=1")
    print(req.read().decode()[:100])
except Exception as e:
    print(f"Error for listings: {e}")
