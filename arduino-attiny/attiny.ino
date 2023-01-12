#include "TinyWireM.h"
float val_seven[7];
#define G 9.8
#define ACCEL_CONFIG 1
#define swpin 4
void setup() {
  pinMode(swpin,OUTPUT);
  digitalWrite(swpin, HIGH); 
  TinyWireM.begin();
  TinyWireM.beginTransmission(0x68);
  TinyWireM.write(0x6B); //  Power setting address
  TinyWireM.write(0b00000000); // Disable sleep mode (just in case)
  TinyWireM.endTransmission();
  TinyWireM.beginTransmission(0x68); //I2C address of the MPU
  TinyWireM.write(0x1C); // Accelerometer config register
  TinyWireM.write(0b00000000); // 2g range +/- (default)
  TinyWireM.endTransmission();
  
}

float totalVector = 0;
float vectorPrevious = 0;
float vector = 0;
int count = 0;

void loop() {
  Get_Value();
  totalVector = val_seven[0] + val_seven[1] + val_seven[2];
  if (vectorPrevious != 0) {
    vector = totalVector - vectorPrevious;
    if (vector > 2 or vector < -2) {

      count ++;
      if (count > 3) {
        digitalWrite(swpin, LOW);
        delay(1000); 
        digitalWrite(swpin, HIGH);
        count = 0;
      }
    } else {
      count = 0;
    }
  }

  vectorPrevious = totalVector;
  delay(200);
}

void Get_Value() {
  TinyWireM.beginTransmission(0x68); //I2C address of the MPU
  TinyWireM.write(0x3B); //  Acceleration data register
  TinyWireM.endTransmission();
  TinyWireM.requestFrom(0x68, 6); // Get 6 bytes, 2 for each DoF
  for (long i = 0; i < 3; ++i)
  {
    val_seven[i] = TinyWireM.read() << 8 | TinyWireM.read();
  }
  //数据换算
  val_seven[0] = (float)(val_seven[0] / 32768 * (2 ^ ACCEL_CONFIG) *
                         G);//acc_x
  val_seven[1] = (float)(val_seven[1] / 32768 * (2 ^ ACCEL_CONFIG) * G);//acc_y
  val_seven[2] = (float)(val_seven[2] / 32768 * (2 ^ ACCEL_CONFIG) *
                         G);//acc_z
}
