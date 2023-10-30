package com.mirablo;

import android.Manifest;
import android.content.pm.PackageManager;
import android.os.Bundle;

import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactActivityDelegate;

import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.atomic.AtomicInteger;

public class MainActivity extends ReactActivity {

  private static final int CAMERA_REQUEST_CODE = 10;
  private static final String[] CAMERA_PERMISSION = new String[]{Manifest.permission.CAMERA};

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "Mirablo";
  }

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    if (!hasCameraPermission()) {
      requestPermission();
    }
  }

  private boolean hasCameraPermission() {
    return ContextCompat.checkSelfPermission(
            this,
            Manifest.permission.CAMERA
    ) == PackageManager.PERMISSION_GRANTED;
  }

  private void requestPermission() {
    ActivityCompat.requestPermissions(
            this,
            CAMERA_PERMISSION,
            CAMERA_REQUEST_CODE
    );
  }

  /**
   * Returns the instance of the {@link ReactActivityDelegate}. Here we use a util class {@link
   * DefaultReactActivityDelegate} which allows you to easily enable Fabric and Concurrent React
   * (aka React 18) with two boolean flags.
   */
  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new DefaultReactActivityDelegate(
        this,
        getMainComponentName(),
        // If you opted-in for the New Architecture, we enable the Fabric Renderer.
        DefaultNewArchitectureEntryPoint.getFabricEnabled());
  }

  @Override
  protected void onDestroy() {
    super.onDestroy();
  }
}
