from unicodedata import name
from flask import Flask, render_template, request, redirect, url_for, flash, jsonify
import json
import sys
import os

#SentimentAnalysisをインポート
from sentiment_analysis import SentimentAnalysis as sa
app = Flask(__name__)
#日本語表示のため
app.config["JSON_AS_ASCII"] = False

@app.route('/',methods=["POST"])
def return_judge():
    #テキストを受け取る
    text = request.form.get("text")
    print(text)
    print(type(text))
    #textに．，！が含まれている場合
    if text == None:
        return jsonify({"message":"textが入力されていません"})
    else:
        if "." in text or "!" in text or '?' in text or '？' in text or '。' in text or '！' in text:
            result = sa.analysis_sentences(text)
            response = json.dumps(result)
            # print('response:',response)
            return jsonify({"message":response})
        else:
            result = sa.analysis_text(text)
            # print('result'+result)
            return jsonify({"message":result})

@app.route("/")
def index():
    return render_template("index.html")

if __name__ == "__main__":
    app.run(debug=True)
    