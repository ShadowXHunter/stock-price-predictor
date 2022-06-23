import pandas as pd
import datetime as dt
import tensorflow as tf
from tensorflow import keras
from sklearn.preprocessing import MinMaxScaler
from sklearn.model_selection import train_test_split
import numpy as np

def predict_stock(stock, start, end):
    c = pd.read_csv("datasets/"+stock+'_meaned.csv')
    c['date'] = pd.to_datetime(c['Date'])
    del c['Date']
    c['Date'] = c['date']
    del c['date']
    
    if(stock=='AMZN'):
        model = keras.models.load_model('models/model_'+stock+'_C')
    else:
        model = keras.models.load_model('models/model_'+stock+'_C_Com')
    sc=MinMaxScaler(feature_range=(0,1))
    dataset_open_scaled=sc.fit_transform(c[['open']])
    sc1=MinMaxScaler(feature_range=(0,1))
    dataset_close_scaled=sc1.fit_transform(c[['close']])
    c['Open'] = dataset_open_scaled
    c['Close'] = dataset_close_scaled
    from sklearn.model_selection import train_test_split
    dataset_train=[]
    dataset_test=[]
    dataset_train,dataset_test=train_test_split(c,test_size=0.3,shuffle=False)

    dataset_test.reset_index(inplace = True)
    del dataset_test['index']
    start_index = dataset_test[dataset_test['Date']==pd.to_datetime(start)].index[0]
    end_index = dataset_test[dataset_test['Date']==pd.to_datetime(end)].index[0]
    X_test = []
    if(stock=="AMZN"):
        for i in range(start_index, end_index+1):
            X_test.append(dataset_test[['Close']].iloc[i-60:i])
    else:
        for i in range(start_index, end_index+1):
            X_test.append(dataset_test[['Close', 'com']].iloc[i-60:i])
    X_test = np.array(X_test,dtype=float)
    X_test = np.reshape(X_test, (X_test.shape[0], X_test.shape[1], X_test.shape[2]))
    predicted_stock_price = model.predict(X_test)
    predicted_stock_price = sc1.inverse_transform(predicted_stock_price)
    predicted_stock_price = np.array(predicted_stock_price)
    real_price = dataset_test.close[start_index:(end_index+1)].tolist()
    dates = dataset_test.Date[start_index:(end_index+1)].dt.strftime('%Y-%m-%d').tolist()
    result= []
    for i in range(len(predicted_stock_price)):
        item= {}
        item['predicted']=predicted_stock_price[i].tolist()[0]
        item['real']=real_price[i]
        item['date']=dates[i]
        result.append(item)

    return result



