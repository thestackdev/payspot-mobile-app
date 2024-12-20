package com.payspot;

import android.app.Activity;
import android.content.Intent;
import android.util.Log;
import android.app.AlertDialog;
import androidx.annotation.NonNull;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.BaseActivityEventListener;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import it.services.pspwdmt.ui.DmtHostActivity;

public class EkycModule extends ReactContextBaseJavaModule {
    private static final int DMT_REQUEST_CODE = 1001;
    private Promise ekycPromise;

    public EkycModule(ReactApplicationContext reactContext) {
        super(reactContext);

        reactContext.addActivityEventListener(mActivityEventListener);
    }

    @Override
    public String getName() {
        return "EkycModule";
    }

    @ReactMethod
    public void startEkyc(String partnerId, String partnerApiKey, String merchantCode, Promise promise) {
        Activity currentActivity = getCurrentActivity();

        if (currentActivity == null) {
            promise.reject("E_ACTIVITY_DOES_NOT_EXIST", "Current activity is null");
            return;
        }

        ekycPromise = promise;

        try {
            Intent intent = new Intent(currentActivity, DmtHostActivity.class);
            intent.putExtra("partnerId", partnerId);
            intent.putExtra("partnerApiKey", partnerApiKey);
            intent.putExtra("merchantCode", merchantCode);

            currentActivity.startActivityForResult(intent, DMT_REQUEST_CODE);

        } catch (Exception e) {
            Log.e("EkycModule", "Failed to launch DmtHostActivity: " + e.getMessage());
            ekycPromise.reject("LAUNCH_FAILED", e.getMessage());
            ekycPromise = null;
        }
    }

    private final ActivityEventListener mActivityEventListener = new BaseActivityEventListener() {
        @Override
        public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
            if (requestCode == DMT_REQUEST_CODE) {
                if (ekycPromise == null) {
                    return;
                }

                if (resultCode == Activity.RESULT_OK) {
                    if (data != null) {
                        String response = data.getStringExtra("response");
                        Log.d("PW_RESPONSE", "Response: " + response);
                        ekycPromise.resolve(response);
                    } else {
                        ekycPromise.reject("NO_DATA", "No data received");
                    }
                } else if (resultCode == Activity.RESULT_CANCELED) {
                    Log.d("PW_RESPONSE", "Transaction Aborted");
                    ekycPromise.reject("TRANSACTION_ABORTED", "User aborted the transaction.");

                    new AlertDialog.Builder(activity)
                            .setMessage("Transaction Aborted")
                            .setPositiveButton("OK", null)
                            .show();
                } else {
                    ekycPromise.reject("UNKNOWN_RESULT", "Unknown result code: " + resultCode);
                }

                ekycPromise = null;
            }
        }
    };
}