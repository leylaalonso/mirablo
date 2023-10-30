package com.mirablo;

import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.google.mediapipe.tasks.components.containers.Category;

import java.security.PublicKey;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class EyeTrackingState extends ReactContextBaseJavaModule {

    public static List<Category> state = null;

    public static void populateState(List<Category> categories){
        if (categories.isEmpty()) {
            state = null;
            return;
        }
        state = categories;
    }

    EyeTrackingState(ReactApplicationContext context) {
        super(context);
    }

    @NonNull
    @Override
    public String getName() {
        return "EyeTrackingState";
    }

    @ReactMethod
    public void getCurrentState(Callback callBack) {
        if (state != null){
            WritableNativeMap returnValue = new WritableNativeMap();
            state.forEach(
                    c -> returnValue.putDouble(c.categoryName(),c.score())
            );
            callBack.invoke(returnValue);
        } else {
            callBack.invoke();
        }

    }
}
