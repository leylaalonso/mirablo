package com.mirablo;

import androidx.annotation.NonNull;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

import java.util.List;
public class EyeTrackingPackage implements ReactPackage {

    @NonNull
    @Override
    public List<NativeModule> createNativeModules(@NonNull ReactApplicationContext reactApplicationContext) {
        return List.of(
                new EyeTrackingState(reactApplicationContext)
        );
    }

    /** @noinspection rawtypes*/
    @NonNull
    @Override
    public List<ViewManager> createViewManagers(@NonNull ReactApplicationContext reactContext) {
        return List.of(
                new EyeTrackingViewManager(reactContext)
        );
    }

}