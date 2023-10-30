package com.mirablo;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Matrix;
import android.graphics.Paint;
import android.graphics.Path;
import android.util.Log;
import android.view.View;

import com.google.mediapipe.tasks.components.containers.Connection;
import com.google.mediapipe.tasks.components.containers.NormalizedLandmark;
import com.google.mediapipe.tasks.vision.facelandmarker.FaceLandmarker;
import com.google.mediapipe.tasks.vision.facelandmarker.FaceLandmarkerResult;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;


public class EyeTrackingView extends View {

    private final List<Integer> UpperLeftEye = List.of(362,398,384,385,386,387,388,466,263);

    private final List<Integer> LowerLeftEye = List.of(249,390,373,374,380,381,382);

    private final List<Integer> LeftEye = List.of(
            /*leftPoint*/362,398,384,385,386,387,388,466,263,
            /*rightPoint*/ 249,390,373,374,380,381,382);

    private final List<Integer> RightEye = List.of(
            /*leftPoint*/33,246,161,159,158,157,173,133,
           /*rightPoint*/155,154,153,145,144,163,7);


    private final List<Integer> LeftIris = List.of(473,  475,474,477,476); //474,475,476,477
    private final List<Integer> RightIris = List.of(468, 470,469,472,471);

    private FaceLandmarkerResult results = null;
    private Paint eyeLinePathPaint = new Paint();

    private Paint eyePaint = new Paint();

    private float scaleFactor = 1;
    private int imageWidth = 1;
    private int imageHeight = 1;

    public EyeTrackingView(Context context) {
        super(context);
    }

    private void initPaints() {
        eyeLinePathPaint.setColor(Color.BLACK);
        eyeLinePathPaint.setStyle(Paint.Style.STROKE);

        eyePaint.setColor(Color.BLACK);
        eyePaint.setStyle(Paint.Style.FILL);
    }

    private void clear() {
        results = null;
        eyeLinePathPaint.reset();
        invalidate();
        initPaints();
    }

    @Override
    public void draw(Canvas canvas) {
        super.draw(canvas);
        if(results == null || results.faceLandmarks().isEmpty()) {
            clear();
            return;
        }


        List<NormalizedLandmark> LeftIrisPoints = LeftIris.stream().map(i -> results.faceLandmarks().get(0).get(i)).collect(Collectors.toList());
        List<NormalizedLandmark> RightIrisPoints = RightIris.stream().map(i -> results.faceLandmarks().get(0).get(i)).collect(Collectors.toList());

        float centerW = (imageWidth * scaleFactor) / 2;
        float centerH = (imageHeight * scaleFactor) / 2;

        float centerEyeW = (LeftIrisPoints.get(0).x() + RightIrisPoints.get(0).x()) / 2f;
        float centerEyeH = (LeftIrisPoints.get(0).y() + RightIrisPoints.get(0).y()) / 2f;

        float eyesXDiff = (LeftIrisPoints.get(0).x() - RightIrisPoints.get(0).x());
        float eyesYDiff = (LeftIrisPoints.get(0).y() - RightIrisPoints.get(0).y());

        double eyesDist = Math.sqrt( (eyesXDiff * eyesXDiff) +  (eyesYDiff * eyesYDiff));

        Matrix matrix = new Matrix();
        matrix.postTranslate(-centerEyeW, -centerEyeH);
        matrix.postScale( imageWidth * scaleFactor * 2, imageWidth * scaleFactor * 2);
        matrix.postTranslate(centerW, 60);

        canvas.concat(matrix);
/*
        Paint paint = new Paint();
        paint.setColor(Color.BLUE);
        canvas.drawRect(0,0,1,1,paint);
        paint.setColor(Color.RED);
        canvas.drawCircle(.5f,.5f, 0.005f,paint);

        paint.setColor(Color.RED);
        canvas.drawCircle(centerEyeW,centerEyeH, 0.005f,paint);
*/


        Path path = new Path();
        applyPath(path,LeftEye.stream().map( i -> results.faceLandmarks().get(0).get(i)).collect(Collectors.toList()));
        applyPath(path, RightEye.stream().map( i -> results.faceLandmarks().get(0).get(i)).collect(Collectors.toList()));

        canvas.drawPath(path, eyeLinePathPaint);
        canvas.clipPath(path);

        // TODO Use proper oval
        canvas.drawOval(
                LeftIrisPoints.get(4).x(),
                LeftIrisPoints.get(1).y(),
                LeftIrisPoints.get(2).x(),
                LeftIrisPoints.get(3).y(),
                eyePaint
        );

        canvas.drawOval(
                RightIrisPoints.get(4).x(),
                RightIrisPoints.get(1).y(),
                RightIrisPoints.get(2).x(),
                RightIrisPoints.get(3).y(),
                eyePaint
        );

        String points = FaceLandmarker.FACE_LANDMARKS_LEFT_IRIS.stream().map(Connection::start).map(String::valueOf).collect(Collectors.joining(","));
    }

    private void applyPath(Path eyePath, List<NormalizedLandmark> eyePoint) {
        eyePath.moveTo(eyePoint.get(0).x(), eyePoint.get(0).y());

        eyePoint.stream().skip(1).forEach(point -> {
            eyePath.lineTo(point.x(),point.y());
        });

        eyePath.close();
    }


    public void drawEyes(FaceLandmarkerResult faceLandmarkerResults, int imageHeight, int imageWidth){
        this.results = faceLandmarkerResults;
        this.imageHeight = imageHeight;
        this.imageWidth = imageWidth;
        this.scaleFactor =  Math.min(getWidth() * 1f / imageWidth, getHeight() * 1f / imageHeight) * 2;
        invalidate();
    }
}
