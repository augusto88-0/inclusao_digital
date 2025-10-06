from flask import Flask, request, jsonify
from openai import OpenAI
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  

client = OpenAI(api_key="SUA_CHAVE_API_AQUI")

@app.route("/avaliar", methods=["POST"])
def avaliar():
    data = request.get_json()
    pergunta = data.get("pergunta", "")
    resposta = data.get("resposta", "")

    prompt = f"""
    Avalie a seguinte resposta de um aluno sobre inclusão digital e tecnologia.
    Pergunta: {pergunta}
    Resposta: {resposta}

    Dê uma nota de 0 a 100 e explique brevemente o motivo.
    Formato da resposta:
    Nota: (número)
    Feedback: (comentário)
    """

    resposta_gpt = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "Você é um professor de tecnologia que avalia respostas curtas."},
            {"role": "user", "content": prompt}
        ]
    )

    texto = resposta_gpt.choices[0].message.content

    # Separar nota e feedback
    nota = 0
    feedback = texto

    if "Nota:" in texto:
        try:
            partes = texto.split("Nota:")[1].split("Feedback:")
            nota = int(partes[0].strip())
            feedback = partes[1].strip()
        except:
            feedback = texto

    return jsonify({"nota": nota, "feedback": feedback})


if __name__ == "__main__":
    app.run(debug=True)
