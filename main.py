import cv2
import serial
import mediapipe as mp
import math

DEBUG = False
RECORD = False

PORT = 'COM3'
BAUD = 115200

if not DEBUG:
    arduino = serial.Serial(PORT, BAUD)

X_L, X_C, X_H = 0, 75, 180
Y_L, Y_C, Y_H = 35, 90, 72
Z_L, Z_C, Z_H = 10, 50, 180

PALM_A_LOW, PALM_A_HIGH = -50, 20
WRIST_LOW, WRIST_HIGH = 0.3, 0.9
SIZE_LOW, SIZE_HIGH = 0.1, 0.7

OPEN, CLOSE = 60, 150
FIST_LIMIT = 3

angles = [X_C, Y_C, Z_C, OPEN]
last = angles.copy()

mp_h = mp.solutions.hands
mp_draw = mp.solutions.drawing_utils

cam = cv2.VideoCapture(0)

if RECORD:
    writer = cv2.VideoWriter(
        "record.avi",
        cv2.VideoWriter_fourcc(*"XVID"),
        60,
        (640, 480)
    )

def bound(v, lo, hi):
    return max(lo, min(hi, v))

def scale(v, i1, i2, o1, o2):
    return int(abs((v - i1) * (o2 - o1) / (i2 - i1) + o1))

def dist(a, b):
    return math.sqrt((a.x - b.x)**2 + (a.y - b.y)**2 + (a.z - b.z)**2)

def closed(hand, size):
    w = hand.landmark[0]
    idx = [7,8,11,12,15,16,19,20]
    total = sum(dist(w, hand.landmark[i]) for i in idx)
    return total / size < FIST_LIMIT

def compute(hand):
    out = [X_C, Y_C, Z_C, OPEN]
    w = hand.landmark[0]
    m = hand.landmark[5]

    size = dist(w, m)

    out[3] = CLOSE if closed(hand, size) else OPEN

    raw = (w.x - m.x) / size
    deg = int(raw * 180 / math.pi)
    deg = bound(deg, PALM_A_LOW, PALM_A_HIGH)
    out[0] = scale(deg, PALM_A_LOW, PALM_A_HIGH, X_H, X_L)

    yv = bound(w.y, WRIST_LOW, WRIST_HIGH)
    out[1] = scale(yv, WRIST_LOW, WRIST_HIGH, Y_H, Y_L)

    size = bound(size, SIZE_LOW, SIZE_HIGH)
    out[2] = scale(size, SIZE_LOW, SIZE_HIGH, Z_H, Z_L)

    return [int(v) for v in out]

with mp_h.Hands(
    model_complexity=0,
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5
) as tracker:

    while cam.isOpened():
        ok, frame = cam.read()
        if not ok:
            continue

        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        rgb.flags.writeable = False
        res = tracker.process(rgb)

        frame.flags.writeable = True

        if res.multi_hand_landmarks:
            h = res.multi_hand_landmarks[0]
            angles = compute(h)

            if angles != last:
                last = angles.copy()
                print(angles)
                if not DEBUG:
                    arduino.write(bytearray(angles))

            for hand in res.multi_hand_landmarks:
                mp_draw.draw_landmarks(frame, hand, mp_h.HAND_CONNECTIONS)

        frame = cv2.flip(frame, 1)
        cv2.putText(frame, str(angles), (10, 35), cv2.FONT_HERSHEY_SIMPLEX, 1, (0,0,255), 2)
        cv2.imshow("Avatar Control", frame)

        if RECORD:
            writer.write(frame)

        if cv2.waitKey(5) & 255 == 27:
            break

cam.release()
cv2.destroyAllWindows()

if RECORD:
    writer.release()
