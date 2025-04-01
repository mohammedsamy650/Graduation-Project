from fastapi import FastAPI
from pydantic import BaseModel
import numpy as np
import joblib
import matplotlib.pyplot as plt
from fastapi.responses import FileResponse

# تحميل الموديل
model = joblib.load("best_rf_model.pkl")

# إنشاء التطبيق
app = FastAPI()

# تعريف نموذج البيانات المستلمة


class InputData(BaseModel):
    rotational_speed: float
    torque: float
    tool_wear: float
    machine_type: int  # 0: L, 1: M, 2: H

# دالة التنبؤ مع التوصيات والرسم البياني


@app.post("/predict")
def predict(data: InputData):
    # تحويل الإدخال إلى مصفوفة NumPy
    features = np.array(
        [[data.rotational_speed, data.torque, data.tool_wear, data.machine_type]])

    # حساب الاحتمالات
    # [prob_no_failure, prob_failure]
    probabilities = model.predict_proba(features)[0]
    probability_failure = probabilities[1]  # احتمالية الفشل
    probability_no_failure = 1 - probability_failure  # احتمالية عدم الفشل

    # تحديد التصنيف الأساسي
    if probability_failure > 0.5:
        base_label = f"Failure: {probability_failure:.2f}"
    else:
        base_label = f"No Failure: {probability_no_failure:.2f}"

    # إضافة توصيات بناءً على النسبة
    if probability_failure > 0.7:
        recommendation = "It is considered a critical case. Immediate attention required."
    elif probability_failure > 0.5:
        recommendation = "Carry out maintenance."
    elif probability_failure > 0.3:
        recommendation = "Perform a preliminary inspection of the machine."
    else:
        recommendation = "Machine is operating normally."

    # إعداد التقرير النهائي
    report_text = {
        "prediction_probability": round(probability_failure, 2),
        "classification": base_label,
        "recommendation": recommendation
    }

    # إنشاء المخطط الدائري (Pie Chart)
    labels = ["No Failure", "Failure"]
    sizes = [probability_no_failure, probability_failure]
    colors = ["green", "red"]

    plt.figure(figsize=(4, 4))
    plt.pie(sizes, labels=labels, autopct="%1.1f%%",
            colors=colors, startangle=90, shadow=True)
    plt.title("Failure Prediction Distribution")

    # حفظ المخطط الدائري كصورة
    pie_chart_path = "prediction_pie_chart.png"
    plt.savefig(pie_chart_path)
    plt.close()

    return {"report": report_text, "graph": pie_chart_path}

# نقطة نهاية لإرجاع الصورة


@app.get("/graph")
def get_graph():
    return FileResponse("prediction_pie_chart.png", media_type="image/png")
