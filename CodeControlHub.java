package org.firstinspires.ftc.teamcode;

import com.qualcomm.robotcore.eventloop.opmode.LinearOpMode;
import com.qualcomm.robotcore.eventloop.opmode.TeleOp;
import com.qualcomm.robotcore.hardware.DcMotor;

@TeleOp(name = "Avatarrobot.java")
public class CodeControlHub extends LinearOpMode {

    private DcMotor RightBack;
    private DcMotor RightFront;
    private DcMotor LeftFront;
    private DcMotor LeftBack;

    @Override
    public void runOpMode() {
        RightBack = hardwareMap.get(DcMotor.class, "RightBack");
        RightFront = hardwareMap.get(DcMotor.class, "RightFront");
        LeftFront = hardwareMap.get(DcMotor.class, "LeftFront");
        LeftBack = hardwareMap.get(DcMotor.class, "LeftBack");

        waitForStart();
        RightBack.setDirection(DcMotor.Direction.REVERSE);
        RightFront.setDirection(DcMotor.Direction.REVERSE);
        while (opModeIsActive()) {
            double y = -gamepad1.left_stick_y;
            double x = gamepad1.left_stick_x;
            double rx = gamepad1.right_stick_x;

            if (Math.abs(y) < 0.05) y = 0;
            if (Math.abs(x) < 0.05) x = 0;
            if (Math.abs(rx) < 0.05) rx = 0;

            double lf = y + x + rx;
            double lb = y - x + rx;
            double rf = y - x - rx;
            double rb = y + x - rx;

            double max = Math.max(Math.abs(lf), Math.max(Math.abs(lb),
                    Math.max(Math.abs(rf), Math.abs(rb))));

            if (max > 1.0) {
                lf /= max;
                lb /= max;
                rf /= max;
                rb /= max;
            }

            LeftFront.setPower(lf);
            LeftBack.setPower(lb);
            RightFront.setPower(rf);
            RightBack.setPower(rb);

        }
    }
}
