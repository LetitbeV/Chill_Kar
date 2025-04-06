package com.sks225.chillkar.model

data class UserProfile(
    val name: String,
    val metamaskAddress: String,
    val age: Int,
    val gender: Gender,
    val region: String,
)
