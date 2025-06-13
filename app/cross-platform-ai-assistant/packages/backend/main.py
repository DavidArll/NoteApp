from fastapi import FastAPI

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Hello World from FastAPI Backend"}

@app.get("/api/hello")
async def hello_api():
    return {"message": "Hello API"}