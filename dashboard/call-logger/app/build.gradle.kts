plugins {
    id("com.android.application") version "8.7.0"
    kotlin("android") version "2.0.21"
}

android {
    namespace = "bd.rajshahirentacar.calllogger"
    compileSdk = 35

    defaultConfig {
        applicationId = "bd.rajshahirentacar.calllogger"
        minSdk = 26
        targetSdk = 35
        versionCode = 1
        versionName = "0.1.0"
    }

    buildTypes {
        release {
            isMinifyEnabled = false
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    kotlinOptions {
        jvmTarget = "17"
    }
}
