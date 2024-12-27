import boto3
import os
import random
import hashlib
import smtplib
import json
from email.mime.text import MIMEText

dynamodb = boto3.resource('dynamodb')

USERS_TABLE = 'USERS_TABLE'
CODES_TABLE = 'CODES_TABLE'
GMAIL_USER = 'josuehidalgoflores@gmail.com'
GMAIL_PASSWORD = 'as'

def is_institutional_email(email):
    return email.endswith('@uni.pe')

def send_verification_email(email, code):
    subject = "Código de Verificación CHATBOT-UNI"
    body = f"Tu código de verificación es: {code}"

    msg = MIMEText(body)
    msg["Subject"] = subject
    msg["From"] = GMAIL_USER
    msg["To"] = email

    with smtplib.SMTP("smtp.gmail.com", 587) as server:
        server.starttls()  
        server.login(GMAIL_USER, GMAIL_PASSWORD)  
        server.sendmail(GMAIL_USER, email, msg.as_string())  

    return {"status": "success", "message": "Correo enviado"}

def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

def register_user_temp(event):
    username = event['username']
    email = event['email']
    password = event['password']

    if not is_institutional_email(email):
        return {
            'statusCode': 400,
            'body': 'El correo debe ser institucional (@uni.pe)'
        }

    verification_code = random.randint(100000, 999999)

    hashed_password = hash_password(password)

    temp_table = dynamodb.Table(CODES_TABLE)
    temp_table.put_item(
        Item={
            'email': email,
            'username': username,
            'password': hashed_password,  
            'verification_code': str(verification_code)
        }
    )

    send_verification_email(email, verification_code)

    return {
        'statusCode': 200,
        'body': 'Código de verificación enviado al correo.'
    }

def verify_and_create_user(event):
    email = event['email']
    code = event['code']

    temp_table = dynamodb.Table(CODES_TABLE)
    response = temp_table.get_item(Key={'email': email})

    if 'Item' not in response:
        return {
            'statusCode': 400,
            'body': 'Código de verificación no encontrado.'
        }

    temp_user = response['Item']

    if temp_user['verification_code'] != code:
        return {
            'statusCode': 400,
            'body': 'Código de verificación incorrecto.'
        }

    users_table = dynamodb.Table(USERS_TABLE)
    users_table.put_item(
        Item={
            'username': temp_user['username'],
            'email': temp_user['email'],
            'password': temp_user['password']  
        }
    )

    temp_table.delete_item(Key={'email': email})

    return {
        'statusCode': 200,
        'body': 'Usuario creado exitosamente.'
    }

def lambda_handler(event, context):
    body = event.get('body')
    if body:
        body = json.loads(body)  

    action = body.get('action') if body else event.get('action')

    if action == 'register_temp':
        return register_user_temp(body if body else event)
    elif action == 'verify':
        return verify_and_create_user(body if body else event)
    else:
        return {
            'statusCode': 400,
            'body': 'Acción no válida.'
        }
