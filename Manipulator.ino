#include <Servo.h>

const byte COUNT = 4;

Servo motors[COUNT];

byte home[COUNT] = {75, 90, 90, 60};
byte current[COUNT];
byte incoming[COUNT];

unsigned long lastSignal = 0;
const unsigned long timeoutMs = 1000;

byte pins[COUNT] = {5, 6, 7, 8};

void resetPosition() {
    for (byte i = 0; i < COUNT; i++) {
        motors[i].write(home[i]);
        current[i] = home[i];
    }
}

void applyAngles() {
    for (byte i = 0; i < COUNT; i++) {
        if (incoming[i] != current[i]) {
            motors[i].write(incoming[i]);
            current[i] = incoming[i];
        }
    }
}

void setup() {
    Serial.begin(115200);

    for (byte i = 0; i < COUNT; i++) {
        motors[i].attach(pins[i]);
        current[i] = home[i];
        motors[i].write(home[i]);
    }

    lastSignal = millis();
}

void loop() {

    if (Serial.available() >= COUNT) {
        Serial.readBytes(incoming, COUNT);
        applyAngles();
        lastSignal = millis();
    }

    if (millis() - lastSignal > timeoutMs) {
        resetPosition();
        lastSignal = millis();
    }
}
