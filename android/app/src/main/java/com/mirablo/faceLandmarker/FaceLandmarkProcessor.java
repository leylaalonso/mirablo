package com.mirablo.faceLandmarker;

import android.content.Context;
import android.graphics.Bitmap;
import android.os.SystemClock;
import android.util.Log;

import com.google.mediapipe.framework.image.BitmapImageBuilder;
import com.google.mediapipe.framework.image.MPImage;
import com.google.mediapipe.tasks.core.BaseOptions;
import com.google.mediapipe.tasks.core.Delegate;
import com.google.mediapipe.tasks.vision.core.RunningMode;
import com.google.mediapipe.tasks.vision.facelandmarker.FaceLandmarker;
import com.google.mediapipe.tasks.vision.facelandmarker.FaceLandmarkerResult;

import java.util.function.BiConsumer;
import java.util.function.Consumer;

public class FaceLandmarkProcessor {

    private final static String MP_FACE_LANDMARKER_TASK = "face_landmarker.task";

    private final static boolean DELEGATE_GPU = true;
    private final static float DEFAULT_FACE_DETECTION_CONFIDENCE = 0.5F;
    private final static float DEFAULT_FACE_TRACKING_CONFIDENCE = 0.5F;
    private final static float DEFAULT_FACE_PRESENCE_CONFIDENCE = 0.5F;
    private final static int DEFAULT_NUM_FACES = 1;

    private final FaceLandmarker faceLandmarker;

    private final BiConsumer<FaceLandmarkerResult,MPImage> listener;

    public FaceLandmarkProcessor(Context context, BiConsumer<FaceLandmarkerResult,MPImage> listener) {
        this.listener = listener;
        BaseOptions.Builder baseOptionBuilder = BaseOptions.builder();

        if(DELEGATE_GPU) {
            baseOptionBuilder.setDelegate(Delegate.GPU);
        } else {
            baseOptionBuilder.setDelegate(Delegate.CPU);
        }

        baseOptionBuilder.setModelAssetPath(MP_FACE_LANDMARKER_TASK);

        BaseOptions baseOptions = baseOptionBuilder.build();
        // Create an option builder with base options and specific
        // options only use for Face Landmarker.
        FaceLandmarker.FaceLandmarkerOptions.Builder optionsBuilder = FaceLandmarker.FaceLandmarkerOptions.builder()
                .setBaseOptions(baseOptions)
                .setMinFaceDetectionConfidence(DEFAULT_FACE_DETECTION_CONFIDENCE)
                .setMinTrackingConfidence(DEFAULT_FACE_TRACKING_CONFIDENCE)
                .setMinFacePresenceConfidence(DEFAULT_FACE_PRESENCE_CONFIDENCE)
                .setNumFaces(DEFAULT_NUM_FACES)
                .setOutputFaceBlendshapes(true)
                .setRunningMode(RunningMode.LIVE_STREAM)
                .setResultListener(this::returnLivestreamResult)
                .setErrorListener(this::returnLivestreamError);
        FaceLandmarker.FaceLandmarkerOptions options = optionsBuilder.build();
        faceLandmarker = FaceLandmarker.createFromOptions(context, options);
    }

    private void returnLivestreamError(RuntimeException e) {
        Log.e("FACELANDMARK",e.getLocalizedMessage(),e);
    }

    private void returnLivestreamResult(FaceLandmarkerResult faceLandmarkerResult, MPImage mpImage) {
        this.listener.accept(faceLandmarkerResult, mpImage);
    }

    public void detectImage(Bitmap image) {
        MPImage mpImage = new BitmapImageBuilder(image).build();
        long frameTime = SystemClock.uptimeMillis();
        faceLandmarker.detectAsync(mpImage,frameTime);
    }

}

