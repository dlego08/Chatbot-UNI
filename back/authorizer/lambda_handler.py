import jwt
from jwt import ExpiredSignatureError, InvalidTokenError

JWT_SECRET = "secret"

def lambda_handler(event, context):

    try:
        token = event.get("authorizationToken", "")

        if not token.startswith("Bearer "):
            print("Invalid token format")
            raise Exception("Unauthorized: Invalid token")

        token = token[7:]

        decoded_token = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])

        email = decoded_token.get("email", "unknown")
        return generate_policy(email, "Allow", event["methodArn"])

    except ExpiredSignatureError:
        print("Token has expired")
        raise Exception("Unauthorized: Invalid token")
    except InvalidTokenError as e:
        print(f"Invalid token: {str(e)}")
        raise Exception("Unauthorized: Invalid token")
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        raise Exception("Unauthorized: Invalid token")


def generate_policy(principal_id, effect, resource):
    return {
        "principalId": principal_id,
        "policyDocument": {
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Action": "execute-api:Invoke",
                    "Effect": effect,
                    "Resource": resource
                }
            ]
        }
    }