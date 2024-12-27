import boto3
import os
import jwt
import datetime
import hashlib
import json

dynamodb = boto3.resource('dynamodb')
USERS_TABLE = 'USERS_TABLE'
JWT_SECRET = 'secret'  

def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

def validate_credentials(email, password):
    hashed_password = hash_password(password)

    users_table = dynamodb.Table(USERS_TABLE)
    response = users_table.get_item(Key={'email': email})

    if 'Item' not in response:
        return False, None

    user = response['Item']
    if user['password'] == hashed_password:  
        return True, user

    return False, None


def generate_jwt(user):
    payload = {
        'email': user['email'],
        'username': user['username'],
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=12)  
    }
    token = jwt.encode(payload, JWT_SECRET, algorithm='HS256')
    return token

def lambda_handler(event, context):
    body = event.get('body')
    if body:
        body = json.loads(body)

    email = body.get('email') if body else event.get('email')
    password = body.get('password') if body else event.get('password')

    if not email or not password:
        return {
            'statusCode': 400,
            'headers': {
                "Access-Control-Allow-Origin": "*",  
                "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Authorization"
            },
            'body': json.dumps({'message': 'Email y password son obligatorios.'})
        }

    is_valid, user = validate_credentials(email, password)
    if not is_valid:
        return {
            'statusCode': 401,
            'headers': {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Authorization"
            },
            'body': json.dumps({'message': 'Credenciales inválidas.'})
        }

    token = generate_jwt(user)

    return {
        'statusCode': 200,
        'headers': {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization"
        },
        'body': json.dumps({
            'message': 'Login exitoso.',
            'token': token
        })
    }
