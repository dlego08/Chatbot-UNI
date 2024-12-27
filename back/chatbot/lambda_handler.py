import os
import boto3
import json

def lambda_handler(event, context):
    try:
        kb_id = 'GPVXM61ASJ'
        model_arn = 'arn:aws:bedrock:us-east-1::foundation-model/anthropic.claude-3-5-sonnet-20240620-v1:0'

        client = boto3.client('bedrock-agent-runtime')

        body = event.get('body')
        if body:
            body = json.loads(body)
        else:
            return {
                'statusCode': 400,
                'body': json.dumps({'error': 'No se proporcionó un body en la solicitud.'})
            }

        input_text = body.get('query')
        if not input_text:
            return {
                'statusCode': 400,
                'body': json.dumps({'error': 'No se proporcionó una consulta en el campo "query".'})
            }

        # Prompt contextual
        context_prompt = (
            "UNI = uni = universidad nacional de ingeniería\n"
            "Eres un agente que solo responde preguntas sobre servicios que la UNI brinda a sus alumnos como comedor, residencia, centro médico, etc.\n"
            "También respondes consultas sobre trámites que realiza un alumno UNI como reclamo de notas, cambio de carrera, convalidación de prácticas preprofesionales, etc.\n"
            "No respondes preguntas como Historia de la UNI, preguntas generales de la UNI como: ¿Dónde queda la UNI?, ¿Cuántas huelgas hubo en la UNI?, etc.\n"
            "No respondes preguntas fuera del ámbito que te definí al inicio.\n"
            f"Usuario: {input_text}"
        )

        response = client.retrieve_and_generate(
            input={
                'text': context_prompt
            },
            retrieveAndGenerateConfiguration={
                'type': 'KNOWLEDGE_BASE',
                'knowledgeBaseConfiguration': {
                    'knowledgeBaseId': kb_id,
                    'modelArn': model_arn
                }
            }
        )

        generated_text = response.get('output', {}).get('text', 'No text generated.')
        return {
            'statusCode': 200,
            'body': json.dumps({'response': generated_text})
        }

    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }
