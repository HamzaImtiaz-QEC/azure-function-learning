import os
import datetime
import random
from azure.storage.blob import BlobServiceClient

import azure.functions as func
import logging

app = func.FunctionApp(http_auth_level=func.AuthLevel.ANONYMOUS)

SECRET_KEY = os.getenv("SECRET_KEY")


@app.route(route="randomnumbers")
def random_number(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Function triggered')

    # Authentication
    key = req.params.get('key') or req.headers.get('key')

    if key != SECRET_KEY:
        return func.HttpResponse(
            "Unauthorized",
            status_code=401
        )

    # Message from URL or JSON body
    message = req.params.get('message')

    if not message:
        try:
            req_body = req.get_json()
            message = req_body.get('message')
        except:
            pass

    if not message:
        message = "No-message"

    # Random number
    number = random.randint(1, 100)

    # Log entry
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    log_entry = f"{timestamp} | Msg: {message} | Number: {number}\n"

    try:
        connection_string = os.getenv("AzureWebJobsStorage")

        blob_service_client = BlobServiceClient.from_connection_string(
            connection_string
        )

        container_name = "logs"
        blob_name = "logs.txt"

        container_client = blob_service_client.get_container_client(
            container_name
        )

        if not container_client.exists():
            container_client.create_container()

        blob_client = container_client.get_blob_client(blob_name)

        try:
            existing_data = (
                blob_client.download_blob()
                .readall()
                .decode("utf-8")
            )
        except:
            existing_data = ""

        updated_data = existing_data + log_entry

        blob_client.upload_blob(
            updated_data,
            overwrite=True
        )

    except Exception as e:
        return func.HttpResponse(
            f"Error: {str(e)}",
            status_code=500
        )

    return func.HttpResponse(
        f"Random Number: {number} | Message: {message}"
    )


@app.route(route="getlogs")
def get_logs(req: func.HttpRequest) -> func.HttpResponse:

    key = req.params.get('key') or req.headers.get('key')

    if key != SECRET_KEY:
        return func.HttpResponse(
            "Unauthorized",
            status_code=401
        )

    try:
        connection_string = os.getenv("AzureWebJobsStorage")

        blob_service_client = BlobServiceClient.from_connection_string(
            connection_string
        )

        blob_client = blob_service_client.get_blob_client(
            container="logs",
            blob="logs.txt"
        )

        log_content = (
            blob_client.download_blob()
            .readall()
            .decode("utf-8")
        )

        return func.HttpResponse(log_content)

    except Exception as e:
        return func.HttpResponse(
            f"Error: {str(e)}",
            status_code=500
        )