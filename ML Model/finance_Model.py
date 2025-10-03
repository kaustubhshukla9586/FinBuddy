
import pandas as pd
import numpy as np
from pathlib import Path
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.linear_model import RidgeCV
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import joblib

CSV_PATH = "finance_savings_dataset.csv"

df = pd.read_csv(CSV_PATH)

FEATURES = [
    "income",
    "total_spend",
    "food_ratio",
    "shopping_ratio",
    "subscriptions_ratio",
    "essential_ratio",
    "spend_variability",
    "avg_txn_size",
    "txn_count",
    "recurring_amount",
    "end_of_month_spike",
    "emi",
    "carry_forward_balance",
]
TARGET = "max_possible_saving"

X = df[FEATURES].copy()
y = df[TARGET].astype(float).copy()

 works.
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=max(1, int(0.2 * len(df))), random_state=42
)

    steps=[
        ("scaler", StandardScaler()),
        ("ridge", RidgeCV(alphas=(0.1, 1.0, 10.0, 100.0), store_cv_values=True)),
    ]
)

model.fit(X_train, y_train)

preds = model.predict(X_test)
mae = mean_absolute_error(y_test, preds)
rmse = mean_squared_error(y_test, preds, squared=False)
r2 = r2_score(y_test, preds)

print("== Test Metrics ==")
print(f"MAE : {mae:,.2f}")
print(f"RMSE: {rmse:,.2f}")
print(f"R²  : {r2:,.4f}")


cv_mae = -cross_val_score(model, X, y, cv=min(5, len(df)), scoring="neg_mean_absolute_error")
print(f"\nCV MAE (mean ± std over {len(cv_mae)} folds): {cv_mae.mean():.2f} ± {cv_mae.std():.2f}")

OUT_PATH = Path("finbuddy_savings_model.pkl")
joblib.dump({"pipeline": model, "features": FEATURES, "target": TARGET}, OUT_PATH)
print(f"\nSaved model to: {OUT_PATH.resolve()}")

example = X.tail(1)
example_pred = model.predict(example)[0]
print("\nExample input (last row):")
print(example.to_dict(orient="records")[0])
print(f"Predicted max_possible_saving: {example_pred:,.2f}")
