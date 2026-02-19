import pandas as pd
import numpy as np
import xgboost as xgb
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_percentage_error
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
import joblib

def train_model():
    print("Loading Indian Port Data...")
    try:
        df = pd.read_csv("indian_port_data.csv")
    except FileNotFoundError:
        print("Error: indian_port_data.csv not found. Run synthetic_data.py first.")
        return

    # 1. Feature Engineering
    print("Feature Engineering...")
    df['hour_sin'] = np.sin(2 * np.pi * df['hour']/24)
    df['hour_cos'] = np.cos(2 * np.pi * df['hour']/24)
    df['is_monsoon'] = (df['rain_1h'] > 5).astype(int)
    
    # 2. Prepare Features & Target
    categorical_features = ['port_name', 'state', 'district']
    numerical_features = ['hour_sin', 'hour_cos', 'day_of_week', 'rain_1h', 'visibility', 'truck_density', 'gate_health', 'is_monsoon']
    
    X = df[categorical_features + numerical_features]
    y = df['total_seconds_to_clear_gate']
    
    # 3. Pipeline (Preprocessing + Model)
    # We used a Pipeline to handle OneHotEncoding automatically for Port Names
    preprocessor = ColumnTransformer(
        transformers=[
            ('cat', OneHotEncoder(handle_unknown='ignore'), categorical_features),
            ('num', 'passthrough', numerical_features)
        ])
        
    model = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('regressor', xgb.XGBRegressor(
            objective='reg:squarederror',
            n_estimators=300, # Increased for better accuracy
            learning_rate=0.05,
            max_depth=8,      # Deeper trees for complex relationships
            n_jobs=-1
        ))
    ])
    
    # 4. Train/Test Split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    print("Training XGBoost Model (this may take a moment due to increased accuracy configs)...")
    model.fit(X_train, y_train)
    
    # 5. Evaluate
    predictions = model.predict(X_test)
    mape = mean_absolute_percentage_error(y_test, predictions)
    accuracy_percentage = (1 - mape) * 100
    
    print(f"Model Accuracy: {accuracy_percentage:.2f}%")
    print(f"MAPE: {mape:.4f}")
    
    if accuracy_percentage > 80:
        print("SUCCESS: Target Accuracy (>80%) Achieved.")
    else:
        print("WARNING: Accuracy below 80%. Tuning required.")
        
    # 6. Save Model
    joblib.dump(model, 'indian_port_model.joblib')
    print("Model saved to indian_port_model.joblib")

if __name__ == "__main__":
    train_model()
