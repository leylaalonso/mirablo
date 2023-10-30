package com.mirablo;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.camera.core.Camera;
import androidx.camera.core.CameraSelector;
import androidx.camera.core.Preview;
import androidx.camera.lifecycle.ProcessCameraProvider;
import androidx.camera.view.PreviewView;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.fragment.app.FragmentTransaction;
import androidx.lifecycle.LifecycleOwner;

import android.Manifest;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.util.AttributeSet;
import android.widget.FrameLayout;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.google.common.util.concurrent.ListenableFuture;

import java.util.concurrent.ExecutionException;
import java.util.concurrent.Executor;
import java.util.concurrent.Executors;

public class MainActivity2 extends AppCompatActivity {

    private static final int CAMERA_REQUEST_CODE = 10;

    private static final String[] CAMERA_PERMISSION = new String[]{Manifest.permission.CAMERA};

    private static TextView textView;

    public static void setText(String text) {
        if(textView != null)
            textView.setText(text);
    }

    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (!hasCameraPermission()) {
            requestPermission();
        }

        LinearLayout root = new LinearLayout(this);
        root.setOrientation(LinearLayout.VERTICAL);
        FrameLayout.LayoutParams param = new FrameLayout.LayoutParams(
                /*width*/ FrameLayout.LayoutParams.MATCH_PARENT,
                /*height*/ 200
        );
        FrameLayout camera = new FrameLayout(this);
        camera.setLayoutParams(param);
        camera.setId(R.id.test_preview_id);
        root.addView(camera);

        textView = new TextView(this);
        textView.setSingleLine(false);
        textView.setText("HOLAAAA");
        root.addView(textView);
        FragmentTransaction fragmentTransaction = getSupportFragmentManager().beginTransaction();

        fragmentTransaction.add(R.id.test_preview_id,new EyeTrackingFragment());
        fragmentTransaction.commit();

        setContentView(root);
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

}