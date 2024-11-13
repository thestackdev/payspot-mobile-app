package com.payspot;

import android.app.Activity;
import android.content.Intent;
import androidx.activity.result.ActivityResultLauncher;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;

import com.lib.sps.KycActivity;

public class EkycModule extends ReactContextBaseJavaModule {
    private Promise ekycPromise;
    private final ReactApplicationContext reactContext;

    public EkycModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "EkycModule";
    }

    @ReactMethod
    public void startEkyc(String ekycToken, Promise promise) {
        Activity currentActivity = getCurrentActivity();
        if (currentActivity == null) {
            promise.reject("E_ACTIVITY_DOES_NOT_EXIST", "Activity doesn't exist");
            return;
        }

        ekycPromise = promise;
        Intent intent = new Intent(currentActivity, KycActivity.class);
        intent.putExtra("EkycToken", ekycToken);
        currentActivity.startActivityForResult(intent, 1000);
    }
}