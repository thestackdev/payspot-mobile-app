package com.payspot;

import android.app.Activity;
import android.content.Intent;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.BaseActivityEventListener;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.module.annotations.ReactModule;

@ReactModule(name = RDServicesDMTModule.NAME)
public class RDServicesDMTModule extends ReactContextBaseJavaModule {

  public static final String NAME = "RDServicesDMT";
  public static final int RDINFO_CODE = 1;
  public static final int RDCAPTURE_CODE = 2;
  private final String SUCCESS = "SUCCESS";
  private final String FAILURE = "FAILURE";
  private String PckName = "";
  private Promise promise;

  private final ActivityEventListener mActivityEventListener = new BaseActivityEventListener() {
    @Override
    public void onActivityResult(
      Activity activity,
      int requestCode,
      int resultCode,
      Intent data
    ) {
      if (data == null) {
        resolve(FAILURE, "No action taken");
        return;
      }

      if (requestCode == RDINFO_CODE) {
        String requiredValue = data.getStringExtra("RD_SERVICE_INFO");

        if (requiredValue == null) {
          resolve(FAILURE, "Device not ready");
          return;
        }
        if (requiredValue.length() <= 10) {
          resolve(FAILURE, "Device not ready");
          return;
        }
        if (requiredValue.toLowerCase().contains("notready")) {
          resolve(FAILURE, "Device not ready");
          return;
        }

        captureData();
        return;
      }

      if (requestCode == RDCAPTURE_CODE) {

        if (data == null) {
          resolve(FAILURE, "Device not ready");
          return;
        }

        String captureXML = data.getStringExtra("PID_DATA");

        if (captureXML == null || captureXML.length() <= 10) {
          resolve(FAILURE, "Device not ready");
          return;
        }
        if (captureXML.toLowerCase().contains("device not ready")) {
          resolve(FAILURE, "Device not ready");
          return;
        }
        resolve(SUCCESS, captureXML);
      }
    }
  };

  public RDServicesDMTModule(ReactApplicationContext reactContext) {
    super(reactContext);
    reactContext.addActivityEventListener(mActivityEventListener);
  }

  @NonNull
  public String getName() {
    return NAME;
  }

  private void deviceInfo() {
    try {
      Intent intent = new Intent();
      intent.setAction("in.gov.uidai.rdservice.fp.INFO");
      Activity currentActivity = getCurrentActivity();


      currentActivity.startActivityForResult(intent, RDINFO_CODE);

    } catch (Exception e) {
      e.printStackTrace();
      resolve(FAILURE, "RD services not available");
    }
  }

  private void captureData() {
    String pidOption =
      "<?xml version='1.0'?><PidOptions ver='1.0'><Opts fCount='1' fType='2' iCount='0' pCount='0' format='0' pidVer='2.0' timeout='10000' posh='UNKNOWN' env='P' wadh='18f4CEiXeXcfGXvgWA/blxD+w2pw7hfQPY45JMytkPw=' /><CustOpts></CustOpts></PidOptions>";
    Intent intent = new Intent();
    intent.setAction("in.gov.uidai.rdservice.fp.CAPTURE");
    intent.putExtra("PID_OPTIONS", pidOption);


    if (PckName.equalsIgnoreCase("com.scl.rdservice")) {
      intent.setPackage("com.scl.rdservice");
    } else if (PckName.equalsIgnoreCase("com.mantra.rdservice")) {
      intent.setPackage("com.mantra.rdservice");
    } else if (PckName.equalsIgnoreCase("com.idemia.l1rdservice")) {
      intent.setPackage("com.idemia.l1rdservice");
    } else if (PckName.equalsIgnoreCase("com.mantra.mfs110.rdservice")) {
      intent.setPackage("com.mantra.mfs110.rdservice");
    } else if (
      PckName.equalsIgnoreCase("com.precision.pb510.rdservice")
    ) {
      intent.setPackage("com.precision.pb510.rdservice");
    } else if (PckName.equalsIgnoreCase("com.secugen.rdservice")) {
      intent.setPackage("com.secugen.rdservice");
    } else if (PckName.equalsIgnoreCase("com.acpl.registersdk")) {
      intent.setPackage("com.acpl.registersdk");
    } else if (
      PckName.equalsIgnoreCase("co.aratek.asix_gms.rdservice")
    ) {
      intent.setPackage("co.aratek.asix_gms.rdservice");
    } else {
      resolve(FAILURE, "RD services Package not found");
    }

    Activity currentActivity = getCurrentActivity();
    try {
      currentActivity.startActivityForResult(intent, RDCAPTURE_CODE);
    } catch (Exception e) {
      e.printStackTrace();
      resolve(FAILURE, "Selected device not found");
    }
  }


  @ReactMethod
  public void getFingerPrint(String deviceName, Promise prm) {
    try {

      promise = prm;
      PckName = deviceName;
      deviceInfo();
    } catch (Exception e) {
      e.printStackTrace();
      resolve(FAILURE, "RD services not available");
    }
  }


  private String ParseBioMetricData(String bioxml) {
    bioxml = bioxml.replaceAll("\"", "'");
    bioxml = bioxml.replaceAll("\\n   ", " ");
    bioxml = bioxml.replaceAll("\\n ", " ");

    return bioxml;
  }


  private void resolve(String status, String message) {
    if (promise == null) {
      return;
    }

    WritableMap map = Arguments.createMap();
    map.putString("status", status.toUpperCase());
    map.putString("message", ParseBioMetricData(message));

    promise.resolve(map);
    promise = null;
  }
}