package com.mirablo;

import android.graphics.Bitmap;
import android.graphics.Matrix;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.camera.core.AspectRatio;
import androidx.camera.core.Camera;
import androidx.camera.core.CameraSelector;
import androidx.camera.core.ImageAnalysis;
import androidx.camera.core.ImageProxy;
import androidx.camera.core.Preview;
import androidx.camera.lifecycle.ProcessCameraProvider;
import androidx.core.content.ContextCompat;
import androidx.fragment.app.Fragment;

import com.google.common.util.concurrent.ListenableFuture;
import com.google.mediapipe.framework.image.BitmapImageBuilder;
import com.google.mediapipe.framework.image.MPImage;
import com.google.mediapipe.tasks.components.containers.Category;
import com.google.mediapipe.tasks.components.containers.NormalizedLandmark;
import com.google.mediapipe.tasks.vision.facelandmarker.FaceLandmarker;
import com.google.mediapipe.tasks.vision.facelandmarker.FaceLandmarkerResult;
import com.mirablo.faceLandmarker.FaceLandmarkProcessor;

import java.util.Collections;
import java.util.List;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Executor;
import java.util.concurrent.Executors;
import java.util.stream.Collectors;

public class EyeTrackingFragment extends Fragment implements ImageAnalysis.Analyzer {
    private EyeTrackingView customView;

    private ListenableFuture<ProcessCameraProvider> cameraProviderFuture;

    private FaceLandmarkProcessor processor;
    private ImageAnalysis imageAnalyzer;

    private final Executor backgroundExecutor = Executors.newSingleThreadExecutor();


    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup parent, Bundle savedInstanceState) {
        super.onCreateView(inflater, parent, savedInstanceState);
        customView = new EyeTrackingView(this.getContext());
        return customView; // this CustomView could be any view that you want to render
    }

    @Override
    public void onViewCreated(View view, Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        cameraProviderFuture = ProcessCameraProvider.getInstance(getActivity());
        cameraProviderFuture.addListener(() -> {
            try {
                ProcessCameraProvider cameraProvider = cameraProviderFuture.get();
                bindPreview(cameraProvider);
            } catch (ExecutionException | InterruptedException e) {
                // No errors need to be handled for this Future.
                // This should never be reached.
            }
        }, ContextCompat.getMainExecutor(getActivity()));
    }

    void bindPreview(@NonNull ProcessCameraProvider cameraProvider) {
        CameraSelector cameraSelector = new CameraSelector.Builder()
                .requireLensFacing(CameraSelector.LENS_FACING_FRONT)
                .build();

        processor = new FaceLandmarkProcessor(getActivity(),this::onFaceResults);

        imageAnalyzer = new ImageAnalysis.Builder()
                        .setTargetAspectRatio(AspectRatio.RATIO_4_3)
                        .setBackpressureStrategy(ImageAnalysis.STRATEGY_KEEP_ONLY_LATEST)
                        .setOutputImageFormat(ImageAnalysis.OUTPUT_IMAGE_FORMAT_RGBA_8888)
                        .build();
        MainActivity2.setText("Procesor conected");
        imageAnalyzer.setAnalyzer(backgroundExecutor,this);
        cameraProvider.unbindAll();

        Camera camera = cameraProvider.bindToLifecycle(this, cameraSelector, imageAnalyzer);
    }

    private void onFaceResults(FaceLandmarkerResult faceLandmarkerResult, MPImage image) {
        getActivity().runOnUiThread( () -> {
            if (faceLandmarkerResult.faceBlendshapes().isPresent()) {
                List<List<Category>> blendShapes = faceLandmarkerResult.faceBlendshapes().get();
                if (!blendShapes.isEmpty()) {
                    EyeTrackingState.populateState(blendShapes.get(0));
                } else {
                    EyeTrackingState.populateState(Collections.emptyList());
                }
            } else {
                EyeTrackingState.populateState(Collections.emptyList());
            }
            customView.drawEyes(faceLandmarkerResult, image.getHeight(), image.getWidth());
        });
    }

    @Override
    public void onPause() {
        super.onPause();
        // do any logic that should happen in an `onPause` method
        // e.g.: customView.onPause();
    }

    @Override
    public void onResume() {
        super.onResume();
        // do any logic that should happen in an `onResume` method
        // e.g.: customView.onResume();

    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        // do any logic that should happen in an `onDestroy` method
        // e.g.: customView.onDestroy();
    }

    @Override
    public void analyze(@NonNull ImageProxy imageProxy) {
        getActivity().runOnUiThread( () -> {
            int width = imageProxy.getWidth();
            int height = imageProxy.getHeight();
            Bitmap bitmapBuffer = Bitmap.createBitmap(
                    width,
                    height,
                    Bitmap.Config.ARGB_8888
            );
            bitmapBuffer.copyPixelsFromBuffer(imageProxy.getPlanes()[0].getBuffer());
            imageProxy.close();

            Matrix matrix = new Matrix();
            // Rotate the frame received from the camera to be in the same direction as it'll be shown
            boolean isFrontCamera = true;
            matrix.postRotate(imageProxy.getImageInfo().getRotationDegrees());

            if (isFrontCamera) {
                matrix.postScale(
                        -1f,
                        1f,
                        imageProxy.getWidth(),
                        imageProxy.getHeight()
                );
            }
            Bitmap rotatedBitmap = Bitmap.createBitmap(
                    bitmapBuffer, 0, 0, bitmapBuffer.getWidth(), bitmapBuffer.getHeight(),
                    matrix, true
            );
            processor.detectImage(rotatedBitmap);
        });
        // Convert the input Bitmap object to an MPImage object to run inference

    }
}