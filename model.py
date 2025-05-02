#Loading imports
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.linear_model import LinearRegression
import pickle

# Read data
df = pd.read_csv('attached_assets/vgsales.csv')

# Remove name column (unnesscary for prediction)
df = df.drop('Name', axis=1)

# List of numerical columns to remove outliers
numerical_cols = [
    'Year', 'NA_Sales', 'EU_Sales', 'JP_Sales', 'Other_Sales', 'Global_Sales'
]


# Fuction to remove ouliers across muliple columns
def remove_outliers(df, columns):
    for col in columns:
        Q1 = df[col].quantile(0.25)
        Q3 = df[col].quantile(0.75)
        IQR = Q3 - Q1
        lower_bound = Q1 - 1.5 * IQR
        upper_bound = Q3 + 1.5 * IQR
        # keep only rows within bounds
        df = df[(df[col] >= lower_bound) & (df[col] <= upper_bound)]
    return df


# Remove outliers
df_cleaned = remove_outliers(df, numerical_cols)

# Handle missing values
df = df.dropna()

# Square root transformation to reduce skewness
sales_columns = [
    'NA_Sales', 'EU_Sales', 'JP_Sales', 'Other_Sales', 'Global_Sales'
]
df[sales_columns] = np.sqrt(df[sales_columns])

# Encode categorical variables
label_encoders = {
    "Platform": LabelEncoder(),
    "Genre": LabelEncoder(),
    "Publisher": LabelEncoder()
}
for col, encoder in label_encoders.items():
    df[col] = encoder.fit_transform(df[col].astype(str))

# Separate Features and Target
features = [
    'NA_Sales', 'EU_Sales', 'JP_Sales', 'Other_Sales', 'Year', 'Rank',
    'Platform', 'Genre', 'Publisher'
]
target = 'Global_Sales'

x = df[features]
y = df[target]

# Split dataset into training and testing set
x_train, x_test, y_train, y_test = train_test_split(df[features],
                                                    df[target],
                                                    test_size=0.2,
                                                    random_state=42)

# Create and Train model
model = LinearRegression()
model.fit(x_train, y_train)

# Load model
pickle.dump(model,
            open("attached_assets/full_linear_regression_model.pkl", "wb"))
